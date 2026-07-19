import { db } from '../../db/client.js';
import { aois } from '../../db/schema/aois.js';
import { eq, and, count, ilike, sql } from 'drizzle-orm';
import { INDIA_STATE_CODES, ERROR_CODES } from '@satmss/shared-constants';
import { CustomError } from '../../middleware/errorHandler.js';
import type { CreateAoiBody, UpdateAoiBody, ListAoisQuery } from './aoi.validation.js';

export class AoiService {
  /**
   * List AOIs with pagination, optional filtering, and aggregate statistics
   * (alert count, pending alert count, last analysis date, last imagery date, area).
   */
  static async listAois(query: ListAoisQuery) {
    const { stateCode, districtName, isActive, priority, page, pageSize } = query;
    const offset = (page - 1) * pageSize;

    // Build WHERE conditions
    const conditions: ReturnType<typeof eq>[] = [];
    if (stateCode) conditions.push(eq(aois.stateCode, stateCode));
    if (isActive !== undefined) conditions.push(eq(aois.isActive, isActive));
    if (priority) conditions.push(eq(aois.priority, priority));
    if (districtName)
      conditions.push(
        // Case-insensitive LIKE for partial district matches
        ilike(aois.districtName, `%${districtName}%`),
      );

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Fetch paginated AOIs
    const rows = await db
      .select({
        id: aois.id,
        name: aois.name,
        geometry: sql<string>`ST_AsGeoJSON(${aois.geometry})::json`,
        stateCode: aois.stateCode,
        stateName: aois.stateName,
        districtName: aois.districtName,
        priority: aois.priority,
        isActive: aois.isActive,
        notes: aois.notes,
        areaHa: aois.areaHa,
        createdBy: aois.createdBy,
        createdAt: aois.createdAt,
        updatedAt: aois.updatedAt,
        // Aggregate statistics via correlated subqueries
        alertCount: sql<number>`(
          SELECT COUNT(*) FROM alerts WHERE alerts.aoi_id = ${aois.id}
        )`.mapWith(Number),
        pendingAlertCount: sql<number>`(
          SELECT COUNT(*) FROM alerts
          WHERE alerts.aoi_id = ${aois.id}
            AND alerts.status = 'PENDING_REVIEW'
        )`.mapWith(Number),
        lastAnalysisDate: sql<string | null>`(
          SELECT MAX(ar.completed_at)::text FROM analysis_runs ar
          WHERE ar.aoi_id = ${aois.id} AND ar.status = 'COMPLETED'
        )`,
        lastImageryDate: sql<string | null>`(
          SELECT MAX(s.acquisition_date) FROM imagery_scenes s
          WHERE s.aoi_id = ${aois.id}
        )`,
      })
      .from(aois)
      .where(whereClause)
      .orderBy(aois.createdAt)
      .limit(pageSize)
      .offset(offset);

    // Count total for pagination
    const [{ total }] = await db
      .select({ total: count() })
      .from(aois)
      .where(whereClause);

    return {
      data: rows,
      pagination: {
        page,
        pageSize,
        total: Number(total),
        totalPages: Math.ceil(Number(total) / pageSize),
      },
    };
  }

  /**
   * Create a new AOI. Geometry is stored as PostGIS geometry using
   * ST_GeomFromGeoJSON. Area is computed server-side via ST_Area.
   */
  static async createAoi(body: CreateAoiBody, createdById: string) {
    const { name, geometry, stateCode, districtName, priority, notes } = body;
    const stateName = INDIA_STATE_CODES[stateCode] ?? stateCode;

    // Check for duplicate name (case-insensitive)
    const [existing] = await db
      .select({ id: aois.id })
      .from(aois)
      .where(sql`LOWER(${aois.name}) = LOWER(${name})`)
      .limit(1);

    if (existing) {
      const err: CustomError = new Error(
        `An AOI named "${name}" already exists. Please choose a unique name.`,
      );
      err.statusCode = 409;
      err.code = ERROR_CODES.CONFLICT;
      throw err;
    }

    const geoJsonString = JSON.stringify(geometry);

    // Compute area in hectares via PostGIS (1 m² = 0.0001 ha)
    const areaResult = await db.execute<{ areaHa: number }>(
      sql`SELECT ROUND((ST_Area(ST_GeomFromGeoJSON(${geoJsonString})::geography) / 10000.0)::numeric, 4)::float AS "areaHa"`,
    );
    const areaHa = areaResult.rows[0]?.areaHa;

    // Insert with PostGIS geometry conversion
    const [created] = await db
      .insert(aois)
      .values({
        name: name.trim(),
        geometry: sql`ST_GeomFromGeoJSON(${geoJsonString})`,
        stateCode,
        stateName,
        districtName: districtName.trim(),
        priority,
        notes: notes ?? null,
        areaHa: areaHa ?? null,
        createdBy: createdById,
      })
      .returning({
        id: aois.id,
        name: aois.name,
        stateCode: aois.stateCode,
        stateName: aois.stateName,
        districtName: aois.districtName,
        priority: aois.priority,
        isActive: aois.isActive,
        notes: aois.notes,
        areaHa: aois.areaHa,
        createdBy: aois.createdBy,
        createdAt: aois.createdAt,
        updatedAt: aois.updatedAt,
      });

    if (!created) {
      const err: CustomError = new Error('Failed to create AOI — database did not return a record.');
      err.statusCode = 500;
      err.code = ERROR_CODES.INTERNAL_ERROR;
      throw err;
    }

    // Re-fetch geometry as GeoJSON for the response
    const geomResult = await db.execute<{ geom: object }>(
      sql`SELECT ST_AsGeoJSON(geometry)::json AS geom FROM aois WHERE id = ${created.id}`,
    );
    const geom = geomResult.rows[0]?.geom;

    return { ...created, geometry: geom };
  }

  /**
   * Get a single AOI by ID including GeoJSON geometry and stats.
   */
  static async getAoiById(id: string) {
    const [row] = await db
      .select({
        id: aois.id,
        name: aois.name,
        geometry: sql<string>`ST_AsGeoJSON(${aois.geometry})::json`,
        stateCode: aois.stateCode,
        stateName: aois.stateName,
        districtName: aois.districtName,
        priority: aois.priority,
        isActive: aois.isActive,
        notes: aois.notes,
        areaHa: aois.areaHa,
        createdBy: aois.createdBy,
        createdAt: aois.createdAt,
        updatedAt: aois.updatedAt,
        alertCount: sql<number>`(
          SELECT COUNT(*) FROM alerts WHERE alerts.aoi_id = ${aois.id}
        )`.mapWith(Number),
        pendingAlertCount: sql<number>`(
          SELECT COUNT(*) FROM alerts
          WHERE alerts.aoi_id = ${aois.id}
            AND alerts.status = 'PENDING_REVIEW'
        )`.mapWith(Number),
        lastAnalysisDate: sql<string | null>`(
          SELECT MAX(ar.completed_at)::text FROM analysis_runs ar
          WHERE ar.aoi_id = ${aois.id} AND ar.status = 'COMPLETED'
        )`,
        lastImageryDate: sql<string | null>`(
          SELECT MAX(s.acquisition_date) FROM imagery_scenes s
          WHERE s.aoi_id = ${aois.id}
        )`,
      })
      .from(aois)
      .where(eq(aois.id, id))
      .limit(1);

    if (!row) {
      const err: CustomError = new Error(`AOI with id "${id}" was not found.`);
      err.statusCode = 404;
      err.code = ERROR_CODES.NOT_FOUND;
      throw err;
    }

    return row;
  }

  /**
   * Update an AOI's mutable fields: name, priority, isActive, notes.
   * Geometry is immutable after creation per the blueprint.
   */
  static async updateAoi(id: string, body: UpdateAoiBody) {
    // Check AOI exists
    await AoiService.getAoiById(id);

    // Check name uniqueness if name is being updated
    if (body.name) {
      const [existing] = await db
        .select({ id: aois.id })
        .from(aois)
        .where(
          and(
            sql`LOWER(${aois.name}) = LOWER(${body.name})`,
            sql`${aois.id} != ${id}`,
          ),
        )
        .limit(1);

      if (existing) {
        const err: CustomError = new Error(
          `An AOI named "${body.name}" already exists. Please choose a unique name.`,
        );
        err.statusCode = 409;
        err.code = ERROR_CODES.CONFLICT;
        throw err;
      }
    }

    const updatePayload: Record<string, unknown> = {
      updatedAt: new Date(),
    };
    if (body.name !== undefined) updatePayload.name = body.name.trim();
    if (body.priority !== undefined) updatePayload.priority = body.priority;
    if (body.isActive !== undefined) updatePayload.isActive = body.isActive;
    if (body.notes !== undefined) updatePayload.notes = body.notes;

    const [updated] = await db
      .update(aois)
      .set(updatePayload)
      .where(eq(aois.id, id))
      .returning({
        id: aois.id,
        name: aois.name,
        stateCode: aois.stateCode,
        stateName: aois.stateName,
        districtName: aois.districtName,
        priority: aois.priority,
        isActive: aois.isActive,
        notes: aois.notes,
        areaHa: aois.areaHa,
        createdBy: aois.createdBy,
        createdAt: aois.createdAt,
        updatedAt: aois.updatedAt,
      });

    // Fetch geometry for response
    const geomResult = await db.execute<{ geom: object }>(
      sql`SELECT ST_AsGeoJSON(geometry)::json AS geom FROM aois WHERE id = ${id}`,
    );
    const geom = geomResult.rows[0]?.geom;

    return { ...updated, geometry: geom };
  }

  /**
   * Soft-delete an AOI (sets isActive = false).
   * Never hard-deletes per blueprint requirement.
   */
  static async deleteAoi(id: string) {
    // Check AOI exists
    await AoiService.getAoiById(id);

    // Check for pending analyses
    const pendingResult = await db.execute<{ id: string }>(
      sql`SELECT id FROM analysis_runs WHERE aoi_id = ${id} AND status IN ('QUEUED', 'RUNNING') LIMIT 1`,
    );
    const pendingRun = pendingResult.rows[0];

    if (pendingRun) {
      const err: CustomError = new Error(
        'Cannot deactivate AOI while an analysis run is in progress. Wait for the analysis to complete or fail.',
      );
      err.statusCode = 409;
      err.code = ERROR_CODES.CONFLICT;
      throw err;
    }

    await db.update(aois).set({ isActive: false, updatedAt: new Date() }).where(eq(aois.id, id));

    return { success: true };
  }
}

import { z } from 'zod';
import { INDIA_STATE_CODES } from '@satmss/shared-constants';

// ---------------------------------------------------------------------------
// GeoJSON Polygon schema (must be a valid WGS-84 Polygon with ≥ 3 vertices)
// ---------------------------------------------------------------------------
const coordinatePair = z.tuple([
  z.number().min(-180).max(180, 'Longitude must be between -180 and 180'),
  z.number().min(-90).max(90, 'Latitude must be between -90 and 90'),
]);

export const geoJsonPolygonSchema = z
  .object({
    type: z.literal('Polygon', {
      errorMap: () => ({ message: 'geometry.type must be "Polygon"' }),
    }),
    coordinates: z
      .array(z.array(coordinatePair))
      .min(1, 'Polygon must have at least one ring (exterior ring)')
      .refine(
        (rings) => {
          // Exterior ring must have at least 4 positions (3 unique + closing point)
          const exterior = rings[0];
          return exterior !== undefined && exterior.length >= 4;
        },
        {
          message:
            'Polygon exterior ring must have at least 4 coordinate pairs (3 unique vertices + closing point).',
        },
      ),
  })
  .strip();

// ---------------------------------------------------------------------------
// AOI CRUD schemas
// ---------------------------------------------------------------------------

export const createAoiSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, 'Name is required')
      .max(100, 'Name must not exceed 100 characters')
      .trim(),
    geometry: geoJsonPolygonSchema,
    stateCode: z
      .string()
      .refine((code) => Object.keys(INDIA_STATE_CODES).includes(code), {
        message: 'stateCode must be a valid ISO 3166-2:IN state code',
      }),
    districtName: z
      .string()
      .min(1, 'districtName is required')
      .max(100, 'districtName must not exceed 100 characters')
      .trim(),
    priority: z.enum(['HIGH', 'MEDIUM', 'LOW'], {
      errorMap: () => ({ message: 'priority must be one of: HIGH, MEDIUM, LOW' }),
    }),
    notes: z.string().max(2000, 'Notes must not exceed 2000 characters').optional(),
  }),
});

export const updateAoiSchema = z.object({
  params: z.object({
    id: z.string().uuid('id must be a valid UUID'),
  }),
  body: z
    .object({
      name: z
        .string()
        .min(1, 'Name is required')
        .max(100, 'Name must not exceed 100 characters')
        .trim()
        .optional(),
      priority: z
        .enum(['HIGH', 'MEDIUM', 'LOW'], {
          errorMap: () => ({ message: 'priority must be one of: HIGH, MEDIUM, LOW' }),
        })
        .optional(),
      isActive: z.boolean().optional(),
      notes: z.string().max(2000, 'Notes must not exceed 2000 characters').optional(),
    })
    .refine((body) => Object.keys(body).length > 0, {
      message: 'At least one field must be provided for update',
    }),
});

export const getAoiSchema = z.object({
  params: z.object({
    id: z.string().uuid('id must be a valid UUID'),
  }),
});

export const listAoisSchema = z.object({
  query: z.object({
    stateCode: z.string().optional(),
    districtName: z.string().optional(),
    isActive: z
      .string()
      .optional()
      .transform((val) => {
        if (val === 'true') return true;
        if (val === 'false') return false;
        return undefined;
      }),
    priority: z.enum(['HIGH', 'MEDIUM', 'LOW']).optional(),
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 1))
      .pipe(z.number().int().min(1)),
    pageSize: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 20))
      .pipe(z.number().int().min(1).max(100)),
  }),
});

export type CreateAoiBody = z.infer<typeof createAoiSchema>['body'];
export type UpdateAoiBody = z.infer<typeof updateAoiSchema>['body'];
export type ListAoisQuery = z.infer<typeof listAoisSchema>['query'];

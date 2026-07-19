import type { Request, Response, NextFunction } from 'express';
import { AoiService } from './aoi.service.js';

export class AoiController {
  static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AoiService.listAois(req.query as any);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const createdById = req.user!.id;
      const result = await AoiService.createAoi(req.body, createdById);
      res.status(201).json({ data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const result = await AoiService.getAoiById(id);
      res.json({ data: result });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const result = await AoiService.updateAoi(id, req.body);
      res.json({ data: result });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const result = await AoiService.deleteAoi(id);
      res.json({ data: result });
    } catch (error) {
      next(error);
    }
  }
}

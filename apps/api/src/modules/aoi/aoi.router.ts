import { Router } from 'express';
import { AoiController } from './aoi.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { createAoiSchema, updateAoiSchema, getAoiSchema, listAoisSchema } from './aoi.validation.js';
import { USER_ROLES } from '@satmss/shared-constants';

const router = Router();

router.get('/', authenticate, validate(listAoisSchema), AoiController.list);
router.post('/', authenticate, authorize(USER_ROLES.ADMIN), validate(createAoiSchema), AoiController.create);
router.get('/:id', authenticate, validate(getAoiSchema), AoiController.getById);
router.patch('/:id', authenticate, authorize(USER_ROLES.ADMIN), validate(updateAoiSchema), AoiController.update);
router.delete('/:id', authenticate, authorize(USER_ROLES.ADMIN), validate(getAoiSchema), AoiController.delete);

export const aoiRouter: Router = router;

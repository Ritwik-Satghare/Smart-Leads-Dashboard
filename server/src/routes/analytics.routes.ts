import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const analyticsController = new AnalyticsController();

router.use(authenticate);

router.get('/overview', analyticsController.getOverview);
router.get('/sources', analyticsController.getSources);
router.get('/status', analyticsController.getStatus);
router.get('/monthly', analyticsController.getMonthly);

export default router;

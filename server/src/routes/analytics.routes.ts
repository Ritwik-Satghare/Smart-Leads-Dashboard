import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const analyticsController = new AnalyticsController();

router.use(authenticate);

/**
 * @swagger
 * /analytics/overview:
 *   get:
 *     summary: Get analytics overview
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics overview fetched successfully
 */
router.get('/overview', analyticsController.getOverview);

/**
 * @swagger
 * /analytics/sources:
 *   get:
 *     summary: Get leads grouped by source
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics sources fetched successfully
 */
router.get('/sources', analyticsController.getSources);

/**
 * @swagger
 * /analytics/status:
 *   get:
 *     summary: Get leads grouped by status
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics status fetched successfully
 */
router.get('/status', analyticsController.getStatus);

/**
 * @swagger
 * /analytics/monthly:
 *   get:
 *     summary: Get monthly leads created in current year
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly analytics fetched successfully
 */
router.get('/monthly', analyticsController.getMonthly);

export default router;

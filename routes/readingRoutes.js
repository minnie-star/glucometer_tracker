const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const readingController = require('../controllers/readingController');

/**
 * @swagger
 * /api/readings:
 *   get:
 *     summary: Get all readings
 *     responses:
 *       200:
 *         description: List of readings
 */

/**
 * @swagger
 * /api/readings:
 *   post:
 *     summary: Add a new reading
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               glucoseLevel:
 *                 type: number
 *               context:
 *                 type: object
 *                 properties:
 *                   meal:
 *                     type: string
 *                   exercise:
 *                     type: string
 *                   notes:
 *                     type: string
 *     responses:
 *       201:
 *         description: Reading created
 */

/**
 * @swagger
 * /api/readings/user/{userId}:
 *   get:
 *     summary: Get all readings for a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of readings
 */

/**
 * @swagger
 * /api/readings/{id}:
 *   get:
 *     summary: Get a single reading by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reading details
 *       404:
 *         description: Reading not found
 */

/**
 * @swagger
 * /api/readings/{id}:
 *   put:
 *     summary: Update a reading
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               glucoseLevel:
 *                 type: number
 *               context:
 *                 type: object
 *                 properties:
 *                   meal:
 *                     type: string
 *                   exercise:
 *                     type: string
 *                   notes:
 *                     type: string
 *     responses:
 *       200:
 *         description: Reading updated
 *       404:
 *         description: Reading not found
 */

/**
 * @swagger
 * /api/readings/{id}:
 *   delete:
 *     summary: Delete a reading
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reading deleted
 *       404:
 *         description: Reading not found
 */


// Get all readings
router.get('/', readingController.getAllReadings);

// Add a new reading
router.post(
  '/',
  [
    body('userId').isMongoId().withMessage('Valid userId is required'),
    body('glucoseLevel').isNumeric().withMessage('Glucose level must be a number'),
    body('context.meal').optional().isString().withMessage('Meal must be a string'),
    body('context.exercise').optional().isString().withMessage('Exercise must be a string'),
    body('context.notes').optional().isString().withMessage('Notes must be a string')
  ],
  readingController.addReading
);

// Get all readings for a user
router.get(
  '/user/:userId',
  [param('userId').isMongoId().withMessage('Valid userId is required')],
  readingController.getReadings
);

// Get a single reading by ID
router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Valid reading ID is required')],
  readingController.getReadingById
);

// Update a reading
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Valid reading ID is required'),
    body('glucoseLevel').optional().isNumeric().withMessage('Glucose level must be a number'),
    body('context.meal').optional().isString().withMessage('Meal must be a string'),
    body('context.exercise').optional().isString().withMessage('Exercise must be a string'),
    body('context.notes').optional().isString().withMessage('Notes must be a string')
  ],
  readingController.updateReading
);

// Delete a reading
router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Valid reading ID is required')],
  readingController.deleteReading
);

module.exports = router;
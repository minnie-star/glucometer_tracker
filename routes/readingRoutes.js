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
 *         description: A list of readings
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

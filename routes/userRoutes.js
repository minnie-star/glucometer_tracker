/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     responses:
 *       201:
 *         description: User created successfully
 */


const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const userController = require('../controllers/userController');

// Get all users
router.get('/', userController.getAllUsers);

// Register new user
router.post(
  '/register',
  [
    body('username')
      .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('email')
      .isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ],
  userController.registerUser
);

// Get user by ID
router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Valid user ID is required')],
  userController.getUser
);

// Update user settings
router.put(
  '/:id/settings',
  [
    param('id').isMongoId().withMessage('Valid user ID is required'),
    body('settings.lowThreshold')
      .optional().isNumeric().withMessage('Low threshold must be a number'),
    body('settings.highThreshold')
      .optional().isNumeric().withMessage('High threshold must be a number'),
    body('settings.units')
      .optional().isIn(['mg/dL', 'mmol/L']).withMessage('Units must be mg/dL or mmol/L')
  ],
  userController.updateUserSettings
);

// Delete user
router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Valid user ID is required')],
  userController.deleteUser
);

module.exports = router;


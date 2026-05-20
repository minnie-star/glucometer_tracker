/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: List of users
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/users/{id}/settings:
 *   put:
 *     summary: Update user settings
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
 *               settings:
 *                 type: object
 *                 properties:
 *                   lowThreshold:
 *                     type: number
 *                   highThreshold:
 *                     type: number
 *                   units:
 *                     type: string
 *     responses:
 *       200:
 *         description: Settings updated
 */

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
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


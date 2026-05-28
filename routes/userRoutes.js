/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     ...
 */

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *           example:
 *             email: "minenhle@example.com"
 *             password: "secret123"
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */

const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const userController = require('../controllers/userController');
const isAuthenticated = require('../middleware/authenticate');

// Public routes
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

router.post('/login', userController.loginUser);
router.get('/logout', userController.logoutUser);

// Protected routes
router.get('/', isAuthenticated, userController.getAllUsers);

router.get(
  '/:id',
  isAuthenticated,
  [param('id').isMongoId().withMessage('Valid user ID is required')],
  userController.getUser
);

router.put(
  '/:id/settings',
  isAuthenticated,
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

router.delete(
  '/:id',
  isAuthenticated,
  [param('id').isMongoId().withMessage('Valid user ID is required')],
  userController.deleteUser
);

module.exports = router;



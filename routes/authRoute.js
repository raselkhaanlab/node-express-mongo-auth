import express from 'express';
import { isActiveUser } from '../middlewares/isActiveUser.js';
import validate from '../utils/yupValidations.js';
import controller from '../controllers/authController.js';
import trimRequest from 'trim-request';

import schemas from '../validations/authValidations.js';

const router = express.Router();
/**
 * @swagger
 * /login:
 *   get:
 *     summary: Retrieve a list of users
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: John Doe
 */
router
  .route('/login')
  .post(trimRequest.all, validate(schemas.loginSchema), controller.login);

router
  .route('/logout')
  .post(trimRequest.all, validate(schemas.logoutSchema), controller.logout);

router
  .route('/refresh-token')
  .post(trimRequest.all, validate(schemas.refreshTokenSchema), controller.refreshToken);

router
  .route('/register')
  .post(trimRequest.all, validate(schemas.registerSchema), controller.register);

router.route("/me")
.get(trimRequest.all, isActiveUser, controller.me)

router
  .route('/reset-password')
  .post(
    trimRequest.all,
    validate(schemas.resetPasswordSchema),
    isActiveUser,
    controller.resetPassword
  );

export default router;

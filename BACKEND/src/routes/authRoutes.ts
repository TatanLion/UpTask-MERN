import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middlewares/validation";
import { authenticate } from "../middlewares/auth";

const router = Router() as Router;

router.post('/create-account',
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Email is not valid'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    // Validate password confirmation
    body('password').custom((value, { req }) => {
        if (value !== req.body.password2) {
            throw new Error('Passwords do not match');
        }
        return true;
    }),
    handleInputErrors,
    AuthController.createAccount
);


router.post('/confirm-account',
    body('token').isNumeric().withMessage('Token is not valid'),
    handleInputErrors,
    AuthController.confirmAccount
);


router.post('/login',
    body('email').isEmail().withMessage('Email is not valid'),
    body('password').notEmpty().withMessage('Password is required'),
    handleInputErrors,
    AuthController.login
);


router.post('/request-code',
    body('email').isEmail().withMessage('Email is not valid'),
    handleInputErrors,
    AuthController.requestConfirmationCode
);


router.post('/forgot-password',
    body('email').isEmail().withMessage('Email is not valid'),
    handleInputErrors,
    AuthController.forgotPassword
);


router.post('/check-token',
    body('token').isNumeric().withMessage('Token is not valid'),
    handleInputErrors,
    AuthController.checkToken
);


router.post('/update-password/:token',
    param('token').isNumeric().withMessage('Token is not valid'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('password').custom((value, { req }) => {
        if (value !== req.body.password2) {
            throw new Error('Passwords do not match');
        }
        return true;
    }),
    handleInputErrors,
    AuthController.updatePasswordWithToken
);


router.get('/user', authenticate, AuthController.user);


export default router;
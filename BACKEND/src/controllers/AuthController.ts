import { Request, Response } from "express";
import bcrypt from "bcrypt";
// @NOTE: Models
import User from "../models/User.model";
import Token from "../models/Token.model";
// @NOTE: Utils
import { generateToken } from '../utils/token';
// @NOTE: Emails
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../utils/jwt";

export class AuthController {

    static createAccount = async (req: Request, res: Response) => {

        try {
            const user = new User(req.body);

            const existUser = await User.findOne({ email: user.email });
            if (existUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const passwordHashed = await bcrypt.hash(user.password, 10);
            user.password = passwordHashed;

            // Generar Token
            const token = new Token();
            token.token = generateToken();
            token.userId = user._id;

            // Enviar email de confirmación
            const emailSent = await AuthEmail.sendEmailVerification({
                name: user.name,
                email: user.email,
                token: parseInt(token.token)
            });

            // Guardar en base de datos User y Token
            const [tokenResult, userResult] = await Promise.all([
                token.save(),
                user.save()
            ]);

            return res.status(201).json({
                message: 'User created successfully',
                user: userResult,
                // token: tokenSaved,
                // emailSent
            });


        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error creating user' });
        }
    }


    static confirmAccount = async (req: Request, res: Response) => {
        try {

            const { token } = req.body;
            const tokenFound = await Token.findOne({ token });

            if (!tokenFound) {
                return res.status(404).json({ message: 'Token not found' });
            }

            const user = await User.findById(tokenFound.userId);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Confirmar cuenta
            user.confirmed = true;

            // Guardar cambios en usuario de cuenta confirmada y eliminar token
            await Promise.allSettled([
                user.save(),
                tokenFound.deleteOne()
            ]);

            return res.status(200).json({
                message: 'Account confirmed successfully',
                user
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error confirming account' });
        }
    }


    static login = async (req: Request, res: Response) => {
        try {

            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (!user.confirmed) {
                const token = new Token();
                token.token = generateToken();
                token.userId = user._id;
                await token.save();

                await AuthEmail.sendEmailVerification({
                    name: user.name,
                    email: user.email,
                    token: parseInt(token.token)
                });

                return res.status(401).json({ message: 'Account not confirmed, please check your email for verification.' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid password' });
            }

            const token = generateJWT({ id: user._id });

            // Remove password from response
            user.password = undefined;

            return res.status(200).json({
                message: 'Login successful',
                user,
                token
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error logging in' });
        }
    }


    static requestConfirmationCode = async (req: Request, res: Response) => {

        try {
            const { email } = new User(req.body);

            const userExists = await User.findOne({ email });
            if (!userExists) {
                return res.status(400).json({ message: 'User not found' });
            }

            if(userExists.confirmed) {
                return res.status(403).json({ message: 'User already confirmed' });
            }

            // Generar Token
            const token = new Token();
            token.token = generateToken();
            token.userId = userExists._id;

            // Enviar email de confirmación
            await AuthEmail.sendEmailVerification({
                name: userExists.name,
                email: userExists.email,
                token: parseInt(token.token)
            });

            // Guardar en base de datos User y Token
            await Promise.all([
                token.save(),
                userExists.save()
            ]);

            return res.status(201).json({
                message: 'New token sent to your email',
                // token: tokenSaved,
                // emailSent
            });


        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error requesting confirmation code' });
        }
    }


    static forgotPassword = async (req: Request, res: Response) => {

        try {
            const { email } = new User(req.body);

            const userExists = await User.findOne({ email });
            if (!userExists) {
                return res.status(400).json({ message: 'User not found' });
            }

            // Generar Token
            const token = new Token();
            token.token = generateToken();
            token.userId = userExists._id;
            await token.save();

            // Enviar email de confirmación
            await AuthEmail.sendEmailForgotPassword({
                name: userExists.name,
                email: userExists.email,
                token: parseInt(token.token)
            });

            return res.status(201).json({
                message: 'Password reset email sent',
                // token: tokenSaved,
                // emailSent
            });


        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error requesting confirmation code' });
        }
    }


    static checkToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.body;
            const tokenExists = await Token.findOne({ token });
            if (!tokenExists) {
                return res.status(400).json({ message: 'Token not found' });
            }
            return res.status(200).json({ message: 'Token is valid' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error checking token' });
        }
    }


    static updatePasswordWithToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.params;
            const { password } = req.body;

            const tokenExists = await Token.findOne({ token });
            if (!tokenExists) {
                return res.status(400).json({ message: 'Token not found' });
            }

            const user = await User.findById(tokenExists.userId);
            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }

            user.password = await bcrypt.hash(password, 10);
            
            await Promise.allSettled([
                user.save(),
                tokenExists.deleteOne()
            ]);

            return res.status(200).json({ message: 'Password updated successfully' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error updating password' });
        }
    }

}


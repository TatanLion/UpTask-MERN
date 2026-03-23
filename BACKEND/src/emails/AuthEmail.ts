import transporter from '../config/nodemailer';
import dotenv from 'dotenv';
dotenv.config();


interface EmailVerificationData {
    name: string;
    email: string;
    token: number;
}

export class AuthEmail {

    static async sendEmailVerification({ name, email, token }: EmailVerificationData) {
        const infoEmail = await transporter.sendMail({
            from: 'UpTask <admin@uptask.com>',
            to: email,
            subject: 'UpTask - Confirm your account',
            text: 'Confirm your account',
            html: this.getEmailVerificationTemplate({ name, token })
        });
        // console.log(infoEmail);
        return infoEmail;
    }

    static getEmailVerificationTemplate({ name, token }: Pick<EmailVerificationData, 'name' | 'token'>) {
        return `
            <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 5px;">
                    <h2 style="color: #333333;">Verificación de Correo Electrónico</h2>
                    <p style="color: #555555;">Hola ${name},</p>
                    <p style="color: #555555;">Gracias por registrarte en UpTask. Por favor, haz clic en el siguiente enlace para verificar tu correo electrónico:</p>
                    <a href="${process.env.FRONTEND_URL}/auth/confirm-account" style="display: inline-block; padding: 10px 20px; color: #ffffff; background-color: #007BFF; text-decoration: none; border-radius: 5px;">Verificar Correo</a>
                    <p style="color: #333333;">O ingresa el siguiente código en la aplicación: <strong>${token}</strong></p>
                    <p style="color: #555555; margin-top: 20px;">Si no solicitaste esta verificación, puedes ignorar este correo.</p>
                </div>
            </div>
        `;
    }

    static async sendEmailForgotPassword({ name, email, token }: EmailVerificationData) {
        const infoEmail = await transporter.sendMail({
            from: 'UpTask <admin@uptask.com>',
            to: email,
            subject: 'UpTask - Reset your password',
            text: 'Reset your password',
            html: this.getEmailForgotPasswordTemplate({ name, token })
        });
        // console.log(infoEmail);
        return infoEmail;
    }

    static getEmailForgotPasswordTemplate({ name, token }: Pick<EmailVerificationData, 'name' | 'token'>) {
        return `
            <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 5px;">
                    <h2 style="color: #333333;">Restablecimiento de Contraseña</h2>
                    <p style="color: #555555;">Hola ${name},</p>
                    <p style="color: #555555;">Has solicitado restablecer tu contraseña. Por favor, haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                    <a href="${process.env.FRONTEND_URL}/auth/new-password" style="display: inline-block; padding: 10px 20px; color: #ffffff; background-color: #007BFF; text-decoration: none; border-radius: 5px;">Restablecer Contraseña</a>
                    <p style="color: #333333;">O ingresa el siguiente código en la aplicación: <strong>${token}</strong></p>
                    <p style="color: #555555; margin-top: 20px;">Si no solicitaste este restablecimiento, puedes ignorar este correo.</p>
                </div>
            </div>
        `;
    }
}   

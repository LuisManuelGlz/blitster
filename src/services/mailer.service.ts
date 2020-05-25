import { Service, Inject } from 'typedi';
import { Transporter } from 'nodemailer';
import config from '../config';

@Service()
export default class MailerService {
  constructor(@Inject('emailClient') private emailClient: Transporter) {}

  async SendEmail(email: string, token: string): Promise<void> {
    let appDomain = config.appUrl;

    if (process.env.NODE_ENV === 'development') {
      appDomain = `${config.appUrl}:${config.port}`;
    }

    const mailOptions = {
      from: 'no-reply@inbox.mailtrap.io',
      to: email,
      subject: 'Blitster - Email Verification',
      text: `
        <h1>Welcome to Blitster 😎!</h1>
        <br/>
        <p>Please verify your email address, it will only take a second</p>
        <a href="${appDomain}/auth/verify/${token}">
          Verify email address
        </a>
      `,
    };

    const info = await this.emailClient.sendMail(mailOptions);

    console.log('Message sent: %s', info.messageId);
  }
}

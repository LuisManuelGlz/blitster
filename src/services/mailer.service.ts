import { Service, Inject } from 'typedi';
import { Transporter } from 'nodemailer';

@Service()
export default class MailerService {
  constructor(@Inject('emailClient') private emailClient: Transporter) {}

  // eslint-disable-next-line class-methods-use-this
  SendEmail(): void {
    console.log('Email send');
  }
}

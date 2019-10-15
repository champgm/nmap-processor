import * as bunyan from 'bunyan';
import * as DotEnv from 'dotenv';
import { NextFunction, Request, Response } from 'express-serve-static-core';
import * as nodemailer from 'nodemailer';
import * as path from 'path';
import { parseStringPromise } from 'xml2js';
import { IEmailRequestBody } from '../interfaces/EmailRequestBody';

const bunyanLogger = bunyan.createLogger({
  name: `${path.basename(__filename)}`,
});

DotEnv.config();

const mailerConfiguration: any = {
  auth: {
    pass: process.env.EMAIL_ACCOUNT_PASSWORD, // generated ethereal password
    user: process.env.EMAIL_ACCOUNT_USERNAME, // generated ethereal user
  },
  host: process.env.EMAIL_SERVER_HOST,
  port: process.env.EMAIL_SERVER_PORT,
  secure: process.env.EMAIL_SERVER_ENCRYPTION, // true for 465, false for other ports
};
const transporter = nodemailer.createTransport(mailerConfiguration);

const recipients = process.env.EMAIL_RECIPIENTS
  ? process.env.EMAIL_RECIPIENTS
  : '{}';
const recipientMap = JSON.parse(recipients);

export async function emailHandler(
  request: Request,
  response: Response,
  nextFunction: NextFunction,
) {
  const fileBuffer: Buffer = (request as any).file.buffer;
  if (fileBuffer) {
    bunyanLogger.info({
      body: request.body,
      headers: request.headers,
      request,
    }, 'REQUEST BODY');

    const fileContents = fileBuffer.toString('utf8');
    const fileJson = await parseStringPromise(fileContents);
    bunyanLogger.info({
      fileContents,
      fileJson,
    }, 'file contents');

    const body: IEmailRequestBody = request.body;

    const recipients = body.recipients
      .map(recipientKey => recipientMap[recipientKey])
      .join(',');
    const mailOptions = {
      from: process.env.EMAIL_ACCOUNT_ADDRESS,
      to: recipients,
      subject: `TO DO: ${body.subject}`,
      text: body.body,
    };

    await transporter.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
        bunyanLogger.info({ error }, 'Error sending message.');
        response.status(500).send({ sendResult: 'Message could not be sent.' });
      } else {
        bunyanLogger.info({ info }, 'Message sent.');
        response.status(200).send({ sendResult: 'Message sent.' });
      }
    });
    return;
  }
  bunyanLogger.error({ request }, 'File not found in request');

  response.status(400).send({ sendResult: 'Invalid request.' });
}

function next(nextFunction: NextFunction, input: any) {
  if (nextFunction) {
    nextFunction(input);
  }
}

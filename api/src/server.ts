import bodyParser from "body-parser";
import compression from "compression";
import express from "express";
import expressBunyan from "express-bunyan-logger";
import morgan from "morgan";
import { EmailRouter } from "./routing/EmailRouter";
import { StaticRouter } from "./routing/StaticRouter";


export const expressApp = express();
expressApp.use(morgan("common"));
expressApp.use(bodyParser.json()as any);
expressApp.use(bodyParser.urlencoded({ extended: true }) as any);
expressApp.use(compression());

expressApp.use(new StaticRouter().init().getRouter());
expressApp.use(new EmailRouter().init().getRouter());

expressApp.use(expressBunyan.errorLogger());

import * as express from "express";
import { Router } from "express";
import { emailHandler } from "../controllers/emailHandler";

export class EmailRouter {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public init(): EmailRouter {
    this.router.post("/email", emailHandler);
    return this;
  }

  public getRouter(): Router {
    return this.router;
  }
}

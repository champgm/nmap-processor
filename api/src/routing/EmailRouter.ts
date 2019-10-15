import * as express from 'express';
import { emailHandler } from '../controllers/emailHandler';
import multer from 'multer';
const upload = multer();

export class EmailRouter {
  private router: express.Router;

  constructor() {
    this.router = express.Router();
  }

  public init(): EmailRouter {
    this.router.post('/email', upload.single('file'), emailHandler);
    return this;
  }

  public getRouter(): express.Router {
    return this.router;
  }
}

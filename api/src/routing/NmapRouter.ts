import * as express from 'express';
import { XmlHandler } from '../handlers/XmlHandler';
import multer from 'multer';
import { Database } from 'sqlite3';
const upload = multer();

export class NmapRouter {

  constructor(
    private xmlHandler:XmlHandler,
    private router: express.Router,
  ) { }

  public init(): NmapRouter {
    this.router.put('/xml', upload.single('file'), this.xmlHandler.handle.bind(this.xmlHandler));
    return this;
  }

  public getRouter(): express.Router {
    return this.router;
  }
}

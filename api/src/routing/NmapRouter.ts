import { XmlHandler } from '../handlers/XmlHandler';
import * as express from 'express';
import multer from 'multer';

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

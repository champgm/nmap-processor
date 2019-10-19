import { XmlHandler } from '../handlers/XmlHandler';
import * as express from 'express';
import multer from 'multer';
import { RetrievalHandler } from '../handlers/RetrievalHandler';

const upload = multer();

export class NmapRouter {

  constructor(
    private xmlHandler: XmlHandler,
    private retrievalHandler: RetrievalHandler,
    private router: express.Router,
  ) { }

  public init(): NmapRouter {
    this.router.put('/xml', upload.single('file'), this.xmlHandler.handle.bind(this.xmlHandler));
    this.router.get('/addresses', this.retrievalHandler.getAllAddresses.bind(this.xmlHandler));
    this.router.get('/addresses/:address', this.retrievalHandler.getOneHost.bind(this.xmlHandler));
    return this;
  }

  public getRouter(): express.Router {
    return this.router;
  }
}

import * as express from 'express';
import * as path from 'path';

export class StaticRouter {
  private router: express.Router;
  private frontend: string;

  constructor() {
    this.router = express.Router();
    this.frontend = path.join(__dirname, '../../dist');
    console.log(`Will host static content from ${this.frontend}`);
  }

  public init(): StaticRouter {
    this.router.use('/', express.static(this.frontend));
    return this;
  }

  public getRouter(): express.Router {
    return this.router;
  }
}

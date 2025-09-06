import express from 'express';
class BaseRoute {
  public router: express.Router;

  constructor() {
    this.router = express.Router();
  }
}
export default BaseRoute;
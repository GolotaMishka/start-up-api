import ErrorBase from './errorBase';

export default class Retry extends ErrorBase {
  public data: any;

  constructor(message: string, data: any) {
    super(message);
    this.data = data;
  }
}

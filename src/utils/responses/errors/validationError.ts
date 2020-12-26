import ErrorBase from './errorBase';

class ValidationError<T> extends ErrorBase {
  public errors: { [K in keyof T]?: string | string[] | object };
  constructor(errors: { [K in keyof T]?: string | string[] | object }) {
    super();
    this.errors = errors;
  }
}
export default ValidationError;

class ErrorBase extends Error {
  public reason: string;

  constructor(message?: string, reason?: string) {
    super(message);

    this.reason = reason || this.constructor.name;
  }
}

export default ErrorBase;

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true; // THIS WILL LET US KNOW IF THE ERROR IS MADE BY US OR NOT

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;

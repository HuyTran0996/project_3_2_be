class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;

//https://nodejs.org/api/errors.html#errorcapturestacktracetargetobject-constructoropt

//     Error.captureStackTrace(this, this.constructor); is a method in Node.js that creates a .stack property on the target object (this), which is an instance of AppError in your case. This .stack property is a string describing the point in the code at which the Error was instantiated 2.

// The Error.captureStackTrace(targetObject, constructorOpt) method takes two arguments:

// targetObject: The object on which to create the .stack property.
// constructorOpt: An optional parameter specifying a function from which the stack trace should start.
// In your case, this refers to the instance of AppError, and this.constructor refers to the AppError function itself. This means that the stack trace starts from the AppError function, excluding the constructor function and any code that called it.

//By using Error.captureStackTrace(), you ensure that the stack trace of your custom error classes accurately reflects the place in your code where the error was actually thrown, rather than the internal implementation of the error class.
//If you remove the line Error.captureStackTrace(this, this.constructor); from your code, the AppError instances will still have a .stack property, but it won't include the stack trace information that you would expect.

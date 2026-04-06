import { ValidationError as ClassValidatorError } from "class-validator";

export class ValidationError extends Error {
  constructor(readonly error: ClassValidatorError[]) {
    super("Validation failed");
    this.name = "ValidationError";
  }
}

export class UserAlreadyExistsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserAlreadyExistsError";
  }
}

export class NotFoundError extends Error {
  constructor(readonly message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

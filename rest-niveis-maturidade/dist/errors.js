"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAlreadyExistsError = exports.ValidationError = void 0;
class ValidationError extends Error {
    constructor(error) {
        super("Validation failed");
        this.error = error;
        this.name = "ValidationError";
    }
}
exports.ValidationError = ValidationError;
class UserAlreadyExistsError extends Error {
    constructor(message) {
        super(message);
        this.name = "UserAlreadyExistsError";
    }
}
exports.UserAlreadyExistsError = UserAlreadyExistsError;

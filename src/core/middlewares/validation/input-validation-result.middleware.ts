import { ValidationError, validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";
import { ValidationErrorType, ValidationErrorDto } from "../../types/validation-error";
import { HttpStatus } from "../../types/http-statuses";

// Оборачивает список ошибок в единый формат ответа: { errorMessage: [...] }.
export const createErrorMessages = (
    errors: ValidationErrorType[],
): ValidationErrorDto => {
    return { errorMessages: errors };
};

// Приводит ошибку express-validator к нашему формату { field, message }.
// У ошибок типа 'field' (body/param - а других валидаторов у нас нет) есть путь к полю.
const formatErrors = (error: ValidationError): ValidationErrorType => {
    if (error.type === 'field') {
        return { field: error.path, message: error.msg};
    }

    // Прочие типы ошибок express-validator у нас не используются.
    return { field: '', message: error.msg};
};

// Собирает результат всех валидаторов запроса. Если есть ошибки — отвечает 400,
// иначе передаёт управление дальше (в handler).
export const inputValidationResultMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const errors = validationResult(req)
        .formatWith(formatErrors)
        .array({ onlyFirstError: true });

    if (errors.length > 0) {
        res.status(HttpStatus.BadRequest).json({ errorMessages: errors});
        return;
    }

    next();
};

// Одна ошибка валидации: какое поле не прошло и почему
export type ValidationErrorType = {
    field: string,
    message: string,
};

// Единый формат тела ответа при ошибке валидации.
export type ValidationErrorDto = { errorMessages: ValidationErrorType[] };

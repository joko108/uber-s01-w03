import { param } from "express-validator";

// В in-memory-хранилище id - обычное число, поэтому проверяем, что параметр
// присутствует и является числовой строкой.
export const idValidation = param('id')
    .exists()
    .withMessage('ID is required')
    .isString()
    .withMessage('ID must be a string')
    .isNumeric()
    .withMessage('ID must be a numeric string');

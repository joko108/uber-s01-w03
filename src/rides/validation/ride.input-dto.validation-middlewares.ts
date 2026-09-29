import { body } from 'express-validator';
import { Currency } from '../types/ride';

const clientNameValidation = body('clientName')
    .isString()
    .withMessage('clientName should be string')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Length of clientName is not correct');

const driverIdValidation = body('driverId')
    .isString()
    .withMessage('driverId must be a string')
    .trim()
    .isMongoId()
    .withMessage('driverId must be a valid ObjectId');

const priceValidation = body('price')
    .isFloat({ gt: 0 }) // цена должна быть числом больше 0
    .withMessage('price must be a positive number');

const currencyValidation = body('currency')
    .isString()
    .withMessage('currency should be string')
    .trim()
    .isIn(Object.values(Currency)) // только допустимые значения enum Currency
    .withMessage('currency must be either "usd" or "eur"');

const fromAddressValidation = body('fromAddress')
    .isString()
    .withMessage('fromAddress should be string')
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage('Length of fromAddress is not correct');

const toAddressValidation = body('toAddress')
    .isString()
    .withMessage('toAddress should be string')
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage('Length of toAddress is not correct');

// Набор middleware-валидаторов тела запроса на создание поездки.
export const rideInputDtoValidation = [
    clientNameValidation,
    driverIdValidation,
    priceValidation,
    currencyValidation,
    fromAddressValidation,
    toAddressValidation,
];

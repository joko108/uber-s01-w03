import { Router } from 'express';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard.middleware';
import { idValidation } from '../../core/middlewares/validation/params-id.validation.middleware';
import { RIDES_ROUTES } from '../constants/rides.paths';
import { rideInputDtoValidation } from '../validation/ride.input-dto.validation-middlewares';
import { createRideHandler } from './handlers/create-ride.handler';
import { getRideListHandler } from './handlers/get-ride-list.handler';
import { getRideHandler } from './handlers/get-ride.handler';
import { finishRideHandler } from './handlers/finish-ride.handler';

export const ridesRouter = Router({});

// Все эндпоинты поездок доступны только супер-админу (Basic Auth).
ridesRouter.use(superAdminGuardMiddleware);

// Каждая цепочка: валидация -> проверка её результата -> handler.
// Пути маршрутов берём из констант модуля, а не из строковых литералов.
ridesRouter
    .get(RIDES_ROUTES.ROOT, getRideListHandler)

    .get(
        RIDES_ROUTES.BY_ID,
        idValidation,
        inputValidationResultMiddleware,
        getRideHandler,
    )

    .post(
        RIDES_ROUTES.ROOT,
        rideInputDtoValidation,
        inputValidationResultMiddleware,
        createRideHandler,
    )

    .post(
        RIDES_ROUTES.FINISH,
        idValidation,
        inputValidationResultMiddleware,
        finishRideHandler,
    );

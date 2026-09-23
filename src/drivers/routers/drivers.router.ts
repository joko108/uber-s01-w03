import { Router } from "express";
import { getDriverListHandler } from "./handlers/get-driver-list.handler";
import { getDriverHandler } from "./handlers/get-driver.handler";
import { createDriverHandler } from "./handlers/create-driver.handler";
import { updateDriverHandler } from "./handlers/update-driver.handler";
import { deleteDriverHandler } from "./handlers/delete-driver.handler";
import { idValidation } from "../../core/middlewares/validation/params-id.validation.middleware";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { driverInputDtoValidation } from "../validation/driver.input-dto.validation-middlewares";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard.middleware";
import { DRIVERS_ROUTES } from "../constants/drivers.paths";

export const driversRouter = Router({});

// Все эндпоинты водителей доступны только супер-админу (Basic Auth).
driversRouter.use(superAdminGuardMiddleware);

// Каждая цепочка: валидация -> проверка результат -> handler
// Пути маршрутов берём из констант модуля, а не из стоковых литералов.
driversRouter
    .get(DRIVERS_ROUTES.ROOT, getDriverListHandler)

    .get(
        DRIVERS_ROUTES.BY_ID,
        idValidation,
        inputValidationResultMiddleware,
        getDriverHandler,
    )

    .post(
        DRIVERS_ROUTES.ROOT,
        driverInputDtoValidation,
        inputValidationResultMiddleware,
        createDriverHandler
    )

    .put(
        DRIVERS_ROUTES.BY_ID,
        idValidation,
        driverInputDtoValidation,
        inputValidationResultMiddleware,
        updateDriverHandler
    )

    .delete(
        DRIVERS_ROUTES.BY_ID,
        idValidation,
        inputValidationResultMiddleware,
        deleteDriverHandler
    );

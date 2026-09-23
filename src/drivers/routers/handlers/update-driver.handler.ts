import { Request, Response } from "express";
import { DriverInputDto } from "../../dto/driver.input.dto";
import { HttpStatus } from "../../../core/types/http-statuses";
import { createErrorMessages } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { driversRepository } from "../../repositories/drivers.repository";

export function updateDriverHandler(
    req: Request<{ id: string }, {}, DriverInputDto>,
    res: Response
) {
    // Тело и id уже проверены middleware-валидаторами.
    // Репозиторий вернет false, если водитель с таким id не найден.
    const isUpdated = driversRepository.update(+req.params.id, req.body);

    if (!isUpdated) {
        res
            .status(HttpStatus.NotFound)
            .send(
                createErrorMessages([{ field: 'id', message: 'Driver not found' }])
            );
        return;
    }

    res.sendStatus(HttpStatus.NoContent);
}

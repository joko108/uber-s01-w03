import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { createErrorMessages } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { driversRepository } from "../../repositories/drivers.repository";

export function deleteDriverHandler(
    req: Request<{ id: string }>,
    res: Response
) {
    // Репозиторий вернёт false, если водитель с таким id не найден.
    const isDeleted = driversRepository.delete(+req.params.id);

    if (!isDeleted) {
        res
            .status(HttpStatus.NotFound)
            .send(
                createErrorMessages([{ field: 'id', message: 'Driver not found' }])
            );
        return;
    }

    res.sendStatus(HttpStatus.NoContent);
}

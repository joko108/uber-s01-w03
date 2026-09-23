import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { createErrorMessages } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { driversRepository } from "../../repositories/drivers.repository";

export function getDriverHandler(req: Request<{ id: string }>, res: Response) {
    const driver = driversRepository.findById(+req.params.id);

    if (!driver) {
        res
            .status(HttpStatus.NotFound)
            .send(
                createErrorMessages([{ field: 'id', message: 'Driver not found' }])
            );
        return;
    }

    res.status(HttpStatus.Ok).send(driver);
}

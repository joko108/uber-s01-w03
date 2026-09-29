import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { driversRepository } from '../../repositories/drivers.repository';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validation-result.middleware';
import { ridesRepository } from '../../../rides/repositories/rides.repository';

export async function deleteDriverHandler(
    req: Request<{ id: string }>,
    res: Response,
) {
    try {
        const id = req.params.id;
        const driver = await driversRepository.findById(id);

        if (!driver) {
            res
                .status(HttpStatus.NotFound)
                .send(
                    createErrorMessages([{ field: 'id', message: 'Driver not found' }]),
                );
            return;
        }

        // Занятого водителя (с активной поездкой) удалять нельзя.
        const activeRide = await ridesRepository.findActiveRideByDriverId(id);
        if (activeRide) {
            res
                .status(HttpStatus.BadRequest)
                .send(
                    createErrorMessages([
                        { field: 'driverId', message: 'The driver is currently on a job' },
                    ]),
                );
            return;
        }

        await driversRepository.delete(id);
        res.sendStatus(HttpStatus.NoContent);
    } catch {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}

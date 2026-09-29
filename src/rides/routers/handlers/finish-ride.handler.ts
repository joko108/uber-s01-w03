import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validation-result.middleware';
import { ridesRepository } from '../../repositories/rides.repository';

export async function finishRideHandler(
    req: Request<{ id: string }, {}, {}>,
    res: Response,
) {
    try {
        const id = req.params.id;
        const ride = await ridesRepository.findById(id);

        if (!ride) {
            res
                .status(HttpStatus.NotFound)
                .send(
                    createErrorMessages([{ field: 'id', message: 'Ride not found' }]),
                );

            return;
        }

        // Повторно завершить уже завершённую поездку нельзя.
        if (ride.finishedAt) {
            res
                .status(HttpStatus.BadRequest)
                .send(
                    createErrorMessages([
                        { field: 'id', message: 'Ride already finished' },
                    ]),
                );

            return;
        }

        await ridesRepository.finishRide(id, new Date());

        res.sendStatus(HttpStatus.NoContent);
    } catch {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}
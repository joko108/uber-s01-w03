import { Request, Response } from 'express';
import { ridesRepository } from '../../repositories/rides.repository';
import { mapToRideViewModel } from '../mappers/map-to-ride-view-model.util';
import { HttpStatus } from '../../../core/types/http-statuses';

export async function getRideListHandler(req: Request, res: Response) {
    try {
        const rides = await ridesRepository.findAll();

        // Наружу отдаём view-model, а не «сырой» документ из БД.
        const rideViewModels = rides.map(mapToRideViewModel);
        res.send(rideViewModels);
    } catch {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}

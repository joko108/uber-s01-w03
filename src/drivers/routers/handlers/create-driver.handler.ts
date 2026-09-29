import { Request, Response } from 'express';
import { DriverInputDto } from '../../dto/driver.input.dto';
import { HttpStatus } from '../../../core/types/http-statuses';
import { driversRepository } from '../../repositories/drivers.repository';
import { Driver } from '../../types/driver';
import { mapToDriverViewModel } from '../mappers/map-to-driver-view-model.util';
import { mapDriverInputDtoToDriver } from '../mappers/map-driver-input-dto-to-driver.util';

export async function createDriverHandler(
    req: Request<{}, {}, DriverInputDto>,
    res: Response,
) {
    try {
        // Проекция DTO -> доменная модель; дату создания добавляем здесь.
        const newDriver: Driver = {
            ...mapDriverInputDtoToDriver(req.body),
            createdAt: new Date(),
        };

        const createdDriver = await driversRepository.create(newDriver);
        const driverViewModel = mapToDriverViewModel(createdDriver);
        res.status(HttpStatus.Created).send(driverViewModel);
    } catch {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}

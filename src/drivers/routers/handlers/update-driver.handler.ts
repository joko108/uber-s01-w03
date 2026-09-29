import { Request, Response } from 'express';
import { DriverInputDto } from '../../dto/driver.input.dto';
import { HttpStatus } from '../../../core/types/http-statuses';
import { driversRepository } from '../../repositories/drivers.repository';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validation-result.middleware';
import { mapDriverInputDtoToDriver } from '../mappers/map-driver-input-dto-to-driver.util';

export async function updateDriverHandler(
    req: Request<{ id: string }, {}, DriverInputDto>,
    res: Response,
) {
    try {
        const id = req.params.id;
        // Важно дождаться промис через await: без него driver — это Promise (всегда truthy),
        // и проверка "не найден" ниже никогда бы не сработала.
        const driver = await driversRepository.findById(id);

        if (!driver) {
            res
                .status(HttpStatus.NotFound)
                .send(
                    createErrorMessages([{ field: 'id', message: 'Driver not found' }]),
                );
            return;
        }

        // В репозиторий передаём доменный объект (проекцию DTO), а не сам DTO.
        await driversRepository.update(id, mapDriverInputDtoToDriver(req.body));
        res.sendStatus(HttpStatus.NoContent);
    } catch {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}

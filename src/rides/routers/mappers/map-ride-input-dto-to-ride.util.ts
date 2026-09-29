import { WithId } from 'mongodb';
import { RideInputDto } from '../../dto/ride.input.dto';
import { Ride } from '../../types/ride';
import { Driver } from '../../../drivers/types/driver';

// Проекция входного DTO (+ данные найденного водителя) на доменную модель поездки.
// Служебные даты жизненного цикла (createdAt/startedAt/…) не выставляем здесь —
// их добавит handler, чтобы маппер отвечал только за перенос данных из DTO/водителя.
// Благодаря этому в репозиторий уходит готовый доменный объект, а не «сырой» DTO.
export function mapRideInputDtoToRide(
    dto: RideInputDto,
    driver: WithId<Driver>,
): Omit<Ride, 'createdAt' | 'updatedAt' | 'startedAt' | 'finishedAt'> {
    return {
        clientName: dto.clientName,
        driver: {
            id: driver._id.toString(),
            name: driver.name,
        },
        // Данные машины копируем из водителя, а не из запроса.
        vehicle: {
            licensePlate: driver.vehicle.licensePlate,
            name: `${driver.vehicle.make} ${driver.vehicle.model}`,
        },
        price: dto.price,
        currency: dto.currency,
        addresses: {
            from: dto.fromAddress,
            to: dto.toAddress,
        },
    };
}

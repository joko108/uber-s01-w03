import { WithId } from 'mongodb';
import { Ride } from '../../types/ride';
import { RideViewModel } from '../../types/ride-view-model';

// Превращает документ поездки из БД (WithId<Ride>) во view-model для ответа API:
// _id (ObjectId) -> строковый id, плюс отдаём только нужные клиенту поля.
export function mapToRideViewModel(ride: WithId<Ride>): RideViewModel {
    return {
        id: ride._id.toString(),
        clientName: ride.clientName,
        driver: ride.driver,
        vehicle: ride.vehicle,
        price: ride.price,
        currency: ride.currency,
        startedAt: ride.startedAt,
        finishedAt: ride.finishedAt,
        addresses: ride.addresses,
    };
}

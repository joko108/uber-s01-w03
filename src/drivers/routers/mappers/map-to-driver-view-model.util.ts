import { WithId } from 'mongodb';
import { Driver } from '../../types/driver';
import { DriverViewModel } from '../../types/driver-view-model';

// Превращает документ водителя из БД (WithId<Driver>) во view-model для ответа API:
// _id (ObjectId) -> строковый id, плюс отдаём только нужные клиенту поля.
export function mapToDriverViewModel(driver: WithId<Driver>): DriverViewModel {
  return {
    id: driver._id.toString(),
    name: driver.name,
    phoneNumber: driver.phoneNumber,
    email: driver.email,
    vehicle: driver.vehicle, // Объект vehicle, не нужно указывать каждое поле
    createdAt: driver.createdAt,
  };
}

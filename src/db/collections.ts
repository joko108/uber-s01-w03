import { Collection, Db } from 'mongodb';
import { Driver } from '../drivers/types/driver';
import { Ride } from '../rides/types/ride';

export const DRIVER_COLLECTION_NAME = 'drivers';
export const RIDE_COLLECTION_NAME = 'rides';

// Коллекции инициализируются один раз в initCollections() после подключения к БД.
// До этого момента они undefined, поэтому обращаться к ним можно только после runDB().
export let driverCollection: Collection<Driver>;
export let rideCollection: Collection<Ride>;

// Создаём объекты коллекций из подключённой базы.
export function initCollections(db: Db): void {
    driverCollection = db.collection<Driver>(DRIVER_COLLECTION_NAME);
    rideCollection = db.collection<Ride>(RIDE_COLLECTION_NAME);
}

// Список всех коллекций считаем в МОМЕНТ вызова (уже после initCollections),
// а не на этапе загрузки модуля — иначе сюда попали бы ещё не инициализированные (undefined) коллекции.
export function getAllCollections(): Collection<any>[] {
    return [driverCollection, rideCollection];
}

import { Ride } from '../types/ride';
import { ObjectId, WithId } from 'mongodb';
import { rideCollection } from '../../db/collections';

// Репозиторий отвечает ТОЛЬКО за доступ к данным (CRUD).
// Он не знает про HTTP и не решает, что делать при "не найдено":
// операции изменения возвращают boolean, а решение о статусе ответа принимает handler.
export const ridesRepository = {
    async findAll(): Promise<WithId<Ride>[]> {
        return rideCollection.find().toArray();
    },

    async findById(id: string): Promise<WithId<Ride> | null> {
        return rideCollection.findOne({ _id: new ObjectId(id) });
    },

    // Активная поездка — та, что ещё не завершена (finishedAt === null).
    // Важно: id водителя хранится во вложенном поле driver.id, поэтому фильтр по 'driver.id'.
    async findActiveRideByDriverId(
        driverId: string,
    ): Promise<WithId<Ride> | null> {
        return rideCollection.findOne({ 'driver.id': driverId, finishedAt: null });
    },

    async create(newRide: Ride): Promise<WithId<Ride>> {
        const insertResult = await rideCollection.insertOne(newRide);
        return { ...newRide, _id: insertResult.insertedId };
    },

    // Возвращает true, если поездка найдена и обновлена, иначе false.
    async finishRide(id: string, finishedAt: Date): Promise<boolean> {
        const updateResult = await rideCollection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    finishedAt,
                    updatedAt: new Date(),
                },
            },
        );

        return updateResult.matchedCount > 0;
    },
};

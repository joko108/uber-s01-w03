import { Driver } from '../types/driver';
import { ObjectId, WithId } from 'mongodb';
import { driverCollection } from '../../db/collections';

// Репозиторий отвечает ТОЛЬКО за доступ к данным (CRUD).
// Он не знает про HTTP и не решает, что делать при "не найдено":
// операции изменения возвращают boolean, а решение о статусе ответа принимает handler.
export const driversRepository = {
    async findAll(): Promise<WithId<Driver>[]> {
        return driverCollection.find().toArray();
    },

    async findById(id: string): Promise<WithId<Driver> | null> {
        return driverCollection.findOne({ _id: new ObjectId(id) });
    },

    async create(newDriver: Driver): Promise<WithId<Driver>> {
        const insertResult = await driverCollection.insertOne(newDriver);
        return { ...newDriver, _id: insertResult.insertedId };
    },

    // Принимает уже готовый доменный объект (без createdAt) — маппинг из DTO делает handler.
    // Возвращает true, если водитель найден и обновлён, иначе false.
    async update(
        id: string,
        driver: Omit<Driver, 'createdAt'>,
    ): Promise<boolean> {
        const updateResult = await driverCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: driver },
        );

        return updateResult.matchedCount > 0;
    },

    // Возвращает true, если водитель найден и удалён, иначе false.
    async delete(id: string): Promise<boolean> {
        const deleteResult = await driverCollection.deleteOne({
            _id: new ObjectId(id),
        });

        return deleteResult.deletedCount > 0;
    },
};

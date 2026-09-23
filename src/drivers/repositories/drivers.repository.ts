import { Driver } from '../types/driver';
import { db } from '../../db/in-memory.db';

// Репозиторий (DAL) отвечает ТОЛЬКО за доступ к данным в in-memory-хранилище.
// Он не знает про HTTP и не решает, что делать при "не найдено":
// операции изменения возвращают boolean, а решение о статусе ответа принимает handler.
export const driversRepository = {
    findAll(): Driver[] {
        return db.drivers;
    },

    findById(id: number): Driver | null {
        // Если ничего не нашли, find вернёт undefined — приводим к null.
        return db.drivers.find((d) => d.id === id) ?? null;
    },

    // Принимает доменные поля без id (id генерируем здесь) и возвращает созданного водителя.
    create(newDriver: Omit<Driver, 'id'>): Driver {
        const lastDriver = db.drivers[db.drivers.length - 1];
        const created: Driver = {
            id: lastDriver ? lastDriver.id + 1 : 1,
            ...newDriver,
        };

        db.drivers.push(created);
        return created;
    },

    // Принимает доменные поля (без служебных id/createdAt).
    // Возвращает true, если водитель найден и обновлён, иначе false.
    update(id: number, driver: Omit<Driver, 'id' | 'createdAt'>): boolean {
        const index = db.drivers.findIndex((d) => d.id === id);

        if (index === -1) {
            return false;
        }

        // Обновляем поля, сохраняя служебные id и createdAt.
        db.drivers[index] = { ...db.drivers[index], ...driver };
        return true;
    },

    // Возвращает true, если водитель найден и удалён, иначе false.
    delete(id: number): boolean {
        const index = db.drivers.findIndex((d) => d.id === id);

        if (index === -1) {
            return false;
        }

        db.drivers.splice(index, 1);
        return true;
    },
};

import express, { Express } from 'express';
import { testingRouter } from './testing/routes/testing.route';
import { ridesRouter } from './rides/routers/rides.router';
import { DRIVERS_PATH } from './drivers/constants/drivers.paths';
import { RIDES_PATH } from './rides/constants/rides.paths';
import { TESTING_PATH } from './testing/constants/testing.paths';
import { driversRouter } from './drivers/routers/drivers.router';

// Настройка маршрутов
export const setupApp = (app: Express) => {
  app.use(express.json());

  // Каждый модуль подключается по своему базовому пути.
  app.use(DRIVERS_PATH, driversRouter);
  app.use(RIDES_PATH, ridesRouter);
  app.use(TESTING_PATH, testingRouter);
};

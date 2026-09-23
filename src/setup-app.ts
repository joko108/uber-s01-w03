import express, { Express, Request, Response} from "express";
import { driversRouter } from "./drivers/routers/drivers.router";
import { TESTING_PATH } from "./testing/constants/testing.paths";
import { DRIVERS_PATH } from "./drivers/constants/drivers.paths";
import { testingRouter } from "./testing/router/testing.router";
import { HttpStatus } from "./core/types/http-statuses";

export const setupApp = (app: Express) => {
    // Парсим JSON
    app.use(express.json());

    // Health-check: простой ответ, что сервер жив
    app.get('/', (req: Request, res: Response) => {
        res.status(HttpStatus.Ok).send('Hello World');
    });

    // Каждый модуль подключается к своему базовому пути
    app.use(DRIVERS_PATH, driversRouter);
    app.use(TESTING_PATH, testingRouter);

    return app;
};

import express from 'express';
import { setupApp } from './setup-app';
import { SETTINGS } from './settings/config';
import { runDB } from './db/mongo.db';

const bootstrap = async () => {
    // Создаем экземпляр приложения Express
    const app = express();

    // Настраиваем маршруты
    setupApp(app);

    const PORT = SETTINGS.PORT;

    // Подключаемся к ДБ до запуска сервера
    await runDB(SETTINGS.MONGO_URL);

    // Запускаем сервер
    app.listen(PORT, () => {
        console.log(`Example app listening on port ${PORT}`);
    });
    return app;
};

bootstrap();

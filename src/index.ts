import express from 'express';
import { setupApp } from "./setup-app";
import { SETTINGS } from "./config";

// Создание приложения
const app = express();
setupApp(app);

const PORT = SETTINGS.PORT;

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});

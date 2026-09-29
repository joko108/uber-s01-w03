import express from 'express';
import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { DRIVERS_PATH } from '../../../src/drivers/constants/drivers.paths';
import { RIDES_PATH } from '../../../src/rides/constants/rides.paths';
import { clearDb } from '../../utils/clear-db';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { createDriver } from '../../utils/drivers/create-driver';
import { getRideDto } from '../../utils/rides/get-ride-dto';
import { SETTINGS } from '../../../src/settings/config';

// Проверяем бизнес-правило: у водителя не может быть двух активных поездок одновременно,
// а занятого (с активной поездкой) водителя нельзя удалить.
describe('Rides API business rules', () => {
    const app = express();
    setupApp(app);

    const adminToken = generateBasicAuthToken();

    beforeAll(async () => {
        await runDB(SETTINGS.MONGO_URL);
        await clearDb(app);
    });

    afterAll(async () => {
        await stopDb();
    });

    it('❌ should not create a second ride for a busy driver; DELETE busy driver is also forbidden', async () => {
        // 1. Создаём водителя и первую (активную) поездку для него.
        const driver = await createDriver(app);

        const firstRideResponse = await request(app)
            .post(RIDES_PATH)
            .set('Authorization', adminToken)
            .send(getRideDto(driver.id))
            .expect(HttpStatus.Created);

        const rideId = firstRideResponse.body.id;

        // 2. Вторую поездку тому же водителю создать нельзя — он уже занят.
        await request(app)
            .post(RIDES_PATH)
            .set('Authorization', adminToken)
            .send(getRideDto(driver.id))
            .expect(HttpStatus.BadRequest);

        // 3. Занятого водителя удалить нельзя.
        await request(app)
            .delete(`${DRIVERS_PATH}/${driver.id}`)
            .set('Authorization', adminToken)
            .expect(HttpStatus.BadRequest);

        // 4. Завершаем поездку — водитель снова свободен.
        await request(app)
            .post(`${RIDES_PATH}/${rideId}/actions/finish`)
            .set('Authorization', adminToken)
            .expect(HttpStatus.NoContent);

        // 5. Теперь и удаление водителя, и новая поездка снова доступны.
        await request(app)
            .post(RIDES_PATH)
            .set('Authorization', adminToken)
            .send(getRideDto(driver.id))
            .expect(HttpStatus.Created);
    });
});

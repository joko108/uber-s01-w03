import request from 'supertest';
import express from 'express';
import { VehicleFeature } from '../../../src/drivers/types/driver';
import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { DriverInputDto } from '../../../src/drivers/dto/driver.input.dto';
import { DRIVERS_PATH } from '../../../src/drivers/constants/drivers.paths';
import { generateBasicAuthToken } from "../../utils/generate-admin-auth-token";
import { clearDb } from "../../utils/clear-db";

describe('Driver API body validation check', () => {
    const app = express();
    setupApp(app);

    const adminToken = generateBasicAuthToken();

    const correctTestDriverData: DriverInputDto = {
        name: 'Valentin',
        phoneNumber: '123-456-7890',
        email: 'valentin@example.com',
        vehicleMake: 'BMW',
        vehicleModel: 'X5',
        vehicleYear: 2021,
        vehicleLicensePlate: 'ABC-123',
        vehicleDescription: 'Some description',
        vehicleFeatures: [VehicleFeature.ChildSeat],
    };

    beforeAll(async () => {
        await clearDb(app);
    });

    it(`❌ should return 401 without auth; POST /api/drivers'`, async () => {
        await request(app)
            .post(DRIVERS_PATH)
            .send(correctTestDriverData)
            .expect(HttpStatus.Unauthorized);
    });

    it(`❌ should not create driver when incorrect body passed; POST /api/drivers`, async () => {
        const invalidDataSet1 = await request(app)
            .post(DRIVERS_PATH)
            .set('Authorization', adminToken)
            .send({
                ...correctTestDriverData,
                name: '   ',
                phoneNumber: '    ',
                email: 'invalid email',
                vehicleMake: '',
            })
            .expect(HttpStatus.BadRequest);

        expect(invalidDataSet1.body.errorMessages).toHaveLength(4);

        const invalidDataSet2 = await request(app)
            .post(DRIVERS_PATH)
            .set('Authorization', adminToken)
            .send({
                ...correctTestDriverData,
                phoneNumber: '', // empty string
                vehicleModel: '', // empty string
                vehicleYear: 'year', // incorrect number
                vehicleLicensePlate: '', // empty string
            })
            .expect(HttpStatus.BadRequest);

        expect(invalidDataSet2.body.errorMessages).toHaveLength(4);

        const invalidDataSet3 = await request(app)
            .post(DRIVERS_PATH)
            .set('Authorization', adminToken)
            .send({
                ...correctTestDriverData,
                name: 'A', // too short
            })
            .expect(HttpStatus.BadRequest);

        expect(invalidDataSet3.body.errorMessages).toHaveLength(1);

        // check что никто не создался
        const driverListResponse = await request(app)
            .get(DRIVERS_PATH)
            .set('Authorization', adminToken);
        expect(driverListResponse.body).toHaveLength(0);
    });

    it('❌ should not update driver when incorrect data passed; PUT /api/drivers/:id', async () => {
        const {
            body: { id: createdDriverId },
        } = await request(app)
            .post(DRIVERS_PATH)
            .set('Authorization', adminToken)
            .send({ ...correctTestDriverData })
            .expect(HttpStatus.Created);

        const invalidDataSet1 = await request(app)
            .put(`${DRIVERS_PATH}/${createdDriverId}`)
            .set('Authorization', adminToken)
            .send({
                ...correctTestDriverData,
                name: '   ',
                phoneNumber: '    ',
                email: 'invalid email',
                vehicleMake: '',
            })
            .expect(HttpStatus.BadRequest);

        expect(invalidDataSet1.body.errorMessages).toHaveLength(4);

        const invalidDataSet2 = await request(app)
            .put(`${DRIVERS_PATH}/${createdDriverId}`)
            .set('Authorization', adminToken)
            .send({
                ...correctTestDriverData,
                phoneNumber: '', // empty string
                vehicleModel: '', // empty string
                vehicleYear: 'year', // incorrect number
                vehicleLicensePlate: '', // empty string
            })
            .expect(HttpStatus.BadRequest);

        expect(invalidDataSet2.body.errorMessages).toHaveLength(4);

        const invalidDataSet3 = await request(app)
            .put(`${DRIVERS_PATH}/${createdDriverId}`)
            .set('Authorization', adminToken)
            .send({
                ...correctTestDriverData,
                name: 'A', //too short
            })
            .expect(HttpStatus.BadRequest);

        expect(invalidDataSet3.body.errorMessages).toHaveLength(1);

        const driverResponse = await request(app)
            .get(`${DRIVERS_PATH}/${createdDriverId}`)
            .set('Authorization', adminToken);

        expect(driverResponse.body).toEqual({
            ...correctTestDriverData,
            id: createdDriverId,
            createdAt: expect.any(String),
        });
    });

    it('❌ should not update driver when incorrect features passed; PUT /api/drivers/:id', async () => {
        const {
            body: { id: createdDriverId },
        } = await request(app)
            .post(DRIVERS_PATH)
            .set('Authorization', adminToken)
            .send({ ...correctTestDriverData })
            .expect(HttpStatus.Created);

        await request(app)
            .put(`${DRIVERS_PATH}/${createdDriverId}`)
            .set('Authorization', adminToken)
            .send({
                ...correctTestDriverData,
                vehicleFeatures: [
                    VehicleFeature.ChildSeat,
                    'invalid-feature',
                    VehicleFeature.WiFi,
                ],
            })
            .expect(HttpStatus.BadRequest);

        const driverResponse = await request(app)
            .get(`${DRIVERS_PATH}/${createdDriverId}`)
            .set('Authorization', adminToken);

        expect(driverResponse.body).toEqual({
            ...correctTestDriverData,
            id: createdDriverId,
            createdAt: expect.any(String),
        });
    });
});

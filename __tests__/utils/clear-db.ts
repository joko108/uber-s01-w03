// @ts-ignore
import request from 'supertest';
import { Express } from 'express';
import { TESTING_PATH } from '../../src/testing/constants/testing.paths';
import { HttpStatus } from '../../src/core/types/http-statuses';

export async function clearDb(app: Express) {
    await request(app)
        .delete(`${TESTING_PATH}/all-data`)
        .expect(HttpStatus.NoContent);
    return;
}

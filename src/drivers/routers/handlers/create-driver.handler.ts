import { Request, Response } from "express";
import { DriverInputDto } from "../../dto/driver.input.dto";
import { HttpStatus } from "../../../core/types/http-statuses";
import { Driver } from "../../types/driver";
import { driversRepository } from "../../repositories/drivers.repository";

export function createDriverHandler(
    req: Request<{}, {}, DriverInputDto>,
    res: Response
) {
    // Тело запроса уже проверено middleware-валидаторами, поэтому здесь только создаем.
    const newDriver: Omit<Driver, 'id'> = {
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        vehicleMake: req.body.vehicleMake,
        vehicleModel: req.body.vehicleModel,
        vehicleYear: req.body.vehicleYear,
        vehicleLicensePlate: req.body.vehicleLicensePlate,
        vehicleDescription: req.body.vehicleDescription,
        vehicleFeatures: req.body.vehicleFeatures,
        createdAt: new Date(),
    };

    const createdDriver = driversRepository.create(newDriver);
    res.status(HttpStatus.Created).send(createdDriver);
}

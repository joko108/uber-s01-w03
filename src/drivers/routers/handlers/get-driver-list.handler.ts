import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { driversRepository } from "../../repositories/drivers.repository";

export function getDriverListHandler(req: Request, res: Response) {
    res.status(HttpStatus.Ok).send(driversRepository.findAll());
}

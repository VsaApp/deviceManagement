import express from 'express';
import db from '../../db';

export const devicesRouter = express.Router();

/**
 * @api {get} /devices/info/:id Get device information
 * @apiVersion 1.0.0
 * @apiName InfoDevice
 * @apiGroup Devices
 *
 * @apiParam {String} id The device id
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {"id":"abc"}
 */
devicesRouter.get('/info/:id', (req, res) => {
    res.json((db.get('devices') || []).filter((device: { id: string }) => device.id === req.params.id)[0] || {});
});

/**
 * @api {get} /devices/list Get device list
 * @apiVersion 1.0.0
 * @apiName ListDevice
 * @apiGroup Devices
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     ["abc"]
 */
devicesRouter.get('/list', (req, res) => {
    res.json((db.get('devices') || []).map((device: { id: string }) => device.id));
});
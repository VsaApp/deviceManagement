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
 *     {"id":"3ab184d09ea78c24921fe1e51c9380782b1e1f32","type":"ipad","name":"iPad-001","groups":["Lehrer-iPads","Test1","blaue iPads"],"battery":0.5}
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
 *     ["3ab184d09ea78c24921fe1e51c9380782b1e1f32","f19a8e2c495a65086b434827566507e3db93244b","203e654ebfa29fefba9c3371ca556e50c9d810e8"]
 */
devicesRouter.get('/list', (req, res) => {
    res.json((db.get('devices') || []).map((device: { id: string }) => device.id));
});
import express from 'express';
import db from '../../db';

export const authRouter = express.Router();

export const isValid = (authStr: string) => {
    return (db.get('users') || [])
        .map((user: { username: string, password: string }) => {
            return Buffer.from(user.username + ':' + user.password).toString('base64');
        }).filter((user: string) => user === authStr).length === 1;
};

export const getUsername = (authStr: string) => {
    return Buffer.from(authStr, 'base64').toString('ascii').split(':')[0];
};

/**
 * @api {get} /auth/login/:auth Check authentication string
 * @apiVersion 1.0.0
 * @apiName AuthenticateUser
 * @apiGroup Authentication
 *
 * @apiParam {String} auth Your authentication string
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {status: 'ValidLogin'}
 *
 * @apiError InvalidLogin Your authentication string is incorrect
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 200 OK
 *     {error: 'InvalidLogin'}
 */
authRouter.get('/login/:auth', (req, res) => {
    if (isValid(req.params.auth)) {
        res.json({status: 'ValidLogin'});
    } else {
        res.json({error: 'InvalidLogin'});
    }
});
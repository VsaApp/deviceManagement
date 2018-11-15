import express from 'express';
import db from '../../db';
import {hasPermission, permissions} from '../permissons/permissions';
import {getUsername, isValid} from '../auth/auth';

export const usersRouter = express.Router();

/**
 * @api {get} /users/add/:auth/:username/:password Create user
 * @apiVersion 1.0.0
 * @apiName CreateUser
 * @apiGroup Users
 *
 * @apiParam {String} auth Your authentication string
 * @apiParam {String} username The name of the user to create
 * @apiParam {String} password The Sha-256 hashed password of the user to create
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {status: 'CreatedUser'}
 *
 * @apiError AlreadyExists A user with this name already exists
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 200 OK
 *     {error: 'AlreadyExists'}
 *
 * @apiError NotAllowed You don't have the needed permission to create a user
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 200 OK
 *     {error: 'NotAllowed'}
 *
 * @apiError InvalidLogin Your authentication string is incorrect
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 200 OK
 *     {error: 'InvalidLogin'}
 */
usersRouter.get('/add/:auth/:username/:password', (req, res) => {
    if (isValid(req.params.auth)) {
        if (hasPermission(getUsername(req.params.auth), permissions.CREATE_USER)) {
            if ((db.get('users') || []).map((user: { username: string }) => user.username).filter((username: string) => username === req.params.username).length === 0) {
                db.set('users', (db.get('users') || []).concat([{
                    username: req.params.username,
                    password: req.params.password || '',
                    permissions: []
                }]));
                res.json({status: 'CreatedUser'});
            } else {
                res.json({error: 'AlreadyExists'});
            }
        } else {
            res.json({error: 'NotAllowed'});
        }
    } else {
        res.json({error: 'InvalidLogin'});
    }
});

/**
 * @api {get} /users/info/:username List user information
 * @apiVersion 1.0.0
 * @apiName InfoUser
 * @apiGroup Users
 *
 * @apiParam {String} username The name of the user
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {"username":"admin","permissions":["ALL"]}
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 200 OK
 *     {}
 */
usersRouter.get('/info/:username', (req, res) => {
    try {
        const user = JSON.parse(JSON.stringify((db.get('users') || []).filter((user: { username: string }) => user.username === req.params.username)[0]));
        delete user.password;
        res.json(user);
    } catch (e) {
        res.json({});
    }
});
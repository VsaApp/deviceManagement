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
 * @api {get} /users/del/:auth/:username Delete user
 * @apiVersion 1.0.0
 * @apiName DeleteUser
 * @apiGroup Users
 *
 * @apiParam {String} auth Your authentication string
 * @apiParam {String} username The name of the user to create
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {status: 'DeletedUser'}
 *
 * @apiError NotExists A user with this name do not exists
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 200 OK
 *     {error: 'NotExists'}
 *
 * @apiError NotAllowed You don't have the needed permission to delete a user or you try to delete the admin user
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 200 OK
 *     {error: 'NotAllowed'}
 *
 * @apiError InvalidLogin Your authentication string is incorrect
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 200 OK
 *     {error: 'InvalidLogin'}
 */

usersRouter.get('/del/:auth/:username', (req, res) => {
    if (isValid(req.params.auth)) {
        if (hasPermission(getUsername(req.params.auth), permissions.DELETE_USER) && req.params.username !== 'admin') {
            if ((db.get('users') || []).map((user: { username: string }) => user.username).filter((username: string) => username === req.params.username).length === 0) {
                res.json({error: 'NotExists'});
            } else {
                db.set('users', (db.get('users') || []).filter((user: {username: string, password: string, permissions: Array<string>}) => user.username !== req.params.username));
                res.json({status: 'DeletedUser'});
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
        if (Object.keys(user).length === 0) res.json({error: 'NotExists'});
        else res.json(user);
    } catch (e) {
        res.json({error: 'NotExists'});
    }
});
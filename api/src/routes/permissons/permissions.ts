import express from 'express';
import db from '../../db';
import {getUsername, isValid} from '../auth/auth';

export const permissionsRouter = express.Router();

const uniq = (arrArg: any) => arrArg.filter((elem: any, pos: number, arr: any[]) => arr.indexOf(elem) == pos);

export enum permissions {
    ALL,
    CHANGE_PERMISSIONS,
    CREATE_USER
}

export const addPermission = (username: string, permission: permissions) => {
    db.set('users', (db.get('users') || []).map((user: { username: string, permissions: string [] }) => {
        if (user.username === username) {
            user.permissions.push(permissionToString(permission));
        }
        user.permissions = uniq(user.permissions);
        return user;
    }))
};

export const removePermission = (username: string, permission: permissions) => {
    db.set('users', (db.get('users') || []).map((user: { username: string, permissions: string [] }) => {
        if (user.username === username) {
            user.permissions.splice(user.permissions.indexOf(permissionToString(permission)), 1);
        }
        return user;
    }))
};

export const getPermissions = (username: string) => {
    return (db.get('users') || []).filter((user: { username: string }) => user.username === username)[0].permissions;
};

export const hasPermission = (username: string, permission: permissions) => {
    const user = (db.get('users') || []).filter((user: { username: string, role: number }) => user.username === username)[0];
    return user.permissions.includes(permissionToString(permission)) || user.permissions.includes(permissionToString(permissions.ALL));
};

export const permissionToString = (permission: permissions) => {
    return permissions[permission];
};

export const stringToPermission = (permission: string) => {
    return (<any>permissions)[permission];
};

export const permissionExists = (permission: string) => {
    for (const k in permissions) if (permissions[k] == permission) return true;
    return false;
};

/**
 * @api {get} /permissions/add/:auth/:username/:permission Add permissions
 * @apiVersion 1.0.0
 * @apiName AddPermission
 * @apiGroup Permissions
 *
 * @apiParam {String} auth Your authentication string
 * @apiParam {String} username The name of the user to create
 * @apiParam {String} permission The name of the permission
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {status: 'AddedPermission'}
 *
 * @apiError UnknownPermission This permission doesn't exist
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 200 OK
 *     {error: 'UnknownPermission'}
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
permissionsRouter.get('/add/:auth/:username/:permission', (req, res) => {
    if (isValid(req.params.auth)) {
        if (hasPermission(getUsername(req.params.auth), permissions.CHANGE_PERMISSIONS)) {
            if (permissionExists(req.params.permission)) {
                addPermission(req.params.username, stringToPermission(req.params.permission));
                res.json({status: 'AddedPermission'});
            } else {
                res.json({error: 'UnknownPermission'});
            }
        } else {
            res.json({error: 'NotAllowed'});
        }
    } else {
        res.json({error: 'InvalidLogin'});
    }
});

/**
 * @api {get} /permissions/remove/:auth/:username/:permission Remove permissions
 * @apiVersion 1.0.0
 * @apiName RemovePermission
 * @apiGroup Permissions
 *
 * @apiParam {String} auth Your authentication string
 * @apiParam {String} username The name of the user to create
 * @apiParam {String} permission The name of the permission
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {status: 'RemovedPermission'}
 *
 * @apiError UnknownPermission This permission doesn't exist
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 200 OK
 *     {error: 'UnknownPermission'}
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
permissionsRouter.get('/remove/:auth/:username/:permission', (req, res) => {
    if (isValid(req.params.auth)) {
        if (hasPermission(getUsername(req.params.auth), permissions.CHANGE_PERMISSIONS)) {
            if (permissionExists(req.params.permission)) {
                removePermission(req.params.username, stringToPermission(req.params.permission));
                res.json({status: 'RemovedPermission'});
            } else {
                res.json({error: 'UnknownPermission'});
            }
        } else {
            res.json({error: 'NotAllowed'});
        }
    } else {
        res.json({error: 'InvalidLogin'});
    }
});

/**
 * @api {get} /permissions/list List permissions
 * @apiVersion 1.0.0
 * @apiName ListPermission
 * @apiGroup Permissions
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     ["ALL","CHANGE_PERMISSIONS","CREATE_USER"]
 *
 */
permissionsRouter.get('/list', (req, res) => {
    res.json(Object.keys(permissions).map((e: any) => permissions[e]).filter((e: any) => typeof e === 'string'));
});
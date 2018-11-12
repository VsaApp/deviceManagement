import express from 'express';
import db from '../../db';
import auth from './auth';
import {
    addPermission,
    hasPermission,
    permissionExists,
    permissions,
    removePermission,
    stringToPermission
} from './permissions';

const users = express.Router();

users.get('/add/:auth/:username/:password', (req, res) => {
    if (auth.isValid(req.params.auth)) {
        if (hasPermission(auth.getUsername(req.params.auth), permissions.CREATE_USER)) {
            if ((db.get('users') || []).map((user: { username: string }) => user.username).filter((username: string) => username === req.params.username).length === 0) {
                db.set('users', (db.get('users') || []).concat([{
                    username: req.params.username,
                    password: req.params.password || '',
                    permissions: []
                }]));
                res.json({status: 'Created user'});
            } else {
                res.json({status: 'Already exists'});
            }
        } else {
            res.json({status: 'Not allowed'});
        }
    } else {
        res.json({status: 'Invalid login'});
    }
});

users.get('/permissions/add/:auth/:username/:permission', (req, res) => {
    if (auth.isValid(req.params.auth)) {
        if (hasPermission(auth.getUsername(req.params.auth), permissions.CHANGE_PERMISSIONS)) {
            if (permissionExists(req.params.permission)) {
                addPermission(req.params.username, stringToPermission(req.params.permission));
                res.json({status: 'Added permission'});
            } else {
                res.json({status: 'Unknown permission'});
            }
        } else {
            res.json({status: 'Not allowed'});
        }
    } else {
        res.json({status: 'Invalid login'});
    }
});

users.get('/permissions/remove/:auth/:username/:permission', (req, res) => {
    if (auth.isValid(req.params.auth)) {
        if (hasPermission(auth.getUsername(req.params.auth), permissions.CHANGE_PERMISSIONS)) {
            if (permissionExists(req.params.permission)) {
                removePermission(req.params.username, stringToPermission(req.params.permission));
                res.json({status: 'Removed permission'});
            } else {
                res.json({status: 'Unknown permission'});
            }
        } else {
            res.json({status: 'Not allowed'});
        }
    } else {
        res.json({status: 'Invalid login'});
    }
});

users.get('/info/:username', (req, res) => {
    try {
        const user = JSON.parse(JSON.stringify((db.get('users') || []).filter((user: { username: string }) => user.username === req.params.username)[0]));
        delete user.password;
        res.json(user);
    } catch (e) {
        res.json({});
    }
});

users.get('/login/:auth', (req, res) => {
    if (auth.isValid(req.params.auth)) {
        res.json({status: 'Valid login'});
    } else {
        res.json({status: 'Invalid login'});
    }
});

export default users;

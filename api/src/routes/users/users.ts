import express from 'express';
import db from '../../db';
import auth from './auth';

const users = express.Router();

users.get('/add/:auth/:username/:password', (req, res) => {
    if (auth.isValid(req.params.auth)) {
        if ((db.get('users') || []).map((user: { username: string }) => user.username).filter((username: string) => username === req.params.username).length === 0) {
            db.set('users', (db.get('users') || []).concat([{
                username: req.params.username,
                password: req.params.password,
                permissions: []
            }]));
            res.json({status: 'Created user'});
        } else {
            res.json({status: 'Already exists'});
        }
    } else {
        res.json({status: 'Invalid login'});
    }
});

users.get('/info/:username', (req, res) => {
    res.json((db.get('users') || []).filter((user: { username: string }) => user.username === req.params.username).map((user: { password: string }) => {
        delete user.password;
        return user;
    })[0]);
});

users.get('/login/:auth', (req, res) => {
    if (auth.isValid(req.params.auth)) {
        res.json({status: 'Valid login'});
    } else {
        res.json({status: 'Invalid login'});
    }
});

export default users;

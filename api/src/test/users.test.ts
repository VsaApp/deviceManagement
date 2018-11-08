import crypto from 'crypto';
import request from 'supertest';
import app from '../app';
import auth from '../routes/users/auth';
import {getPermissions} from "../routes/users/permissions";

describe('Users', () => {
    let user = 'test';
    let password = crypto.createHash('sha256').update('123').digest('hex');
    let authStr = Buffer.from('admin:').toString('base64');
    test('Create user ' + user, () =>
        request(app)
            .get('/users/add/' + authStr + '/' + user + '/' + password)
            .then((response: any) =>
                expect(response.body).toEqual({status: 'Created user'})
            )
    );
    test('Add already existing user ' + user, () =>
        request(app)
            .get('/users/add/' + authStr + '/' + user + '/' + password)
            .then((response: any) =>
                expect(response.body).toEqual({status: 'Already exists'})
            )
    );
    test('Cannot create user ' + user + ' with invalid credentials', () =>
        request(app)
            .get('/users/add/INVALIDAUTH/' + user + '/' + password)
            .then((response: any) =>
                expect(response.body).toEqual({status: 'Invalid login'})
            )
    );
    test('Check user ' + user + ' info', () =>
        request(app)
            .get('/users/info/' + user)
            .then((response: any) =>
                expect(response.body).toEqual({username: user, permissions: []})
            )
    );
    describe('Authentication', () => {
        test('Validates correctly', () => {
            expect(auth.isValid(authStr)).toBeTruthy();
            expect(auth.isValid(authStr + '123')).toBeFalsy();
        });
        test('Login working', () => {
            request(app).get('/users/login/' + authStr).then((response: any) => expect(response.body).toEqual({status: 'Valid login'}));
            request(app).get('/users/login/' + authStr + '123').then((response: any) => expect(response.body).toEqual({status: 'Invalid login'}));
        });
    });
    describe('Permissions', () => {
        test('User ' + user + ' has no permissions', () =>
            expect(getPermissions(user)).toEqual([])
        );
        test('User ' + user + ' has no permissions', () =>
            expect(getPermissions(user)).toEqual([])
        );
    });
});
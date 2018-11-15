import crypto from 'crypto';
import request from 'supertest';
import app from '../app';

describe('Users', () => {
    let user = 'test';
    let password = crypto.createHash('sha256').update('123').digest('hex');
    let authStr = Buffer.from('admin:').toString('base64');
    test('Create user ' + user, () =>
        request(app)
            .get('/users/add/' + authStr + '/' + user + '/' + password)
            .then((response: any) =>
                expect(response.body).toEqual({status: 'CreatedUser'})
            )
    );
    test('Add already existing user ' + user, () =>
        request(app)
            .get('/users/add/' + authStr + '/' + user + '/' + password)
            .then((response: any) =>
                expect(response.body).toEqual({error: 'AlreadyExists'})
            )
    );
    test('Cannot create user ' + user + ' with invalid credentials', () =>
        request(app)
            .get('/users/add/INVALIDAUTH/' + user + '/' + password)
            .then((response: any) =>
                expect(response.body).toEqual({error: 'InvalidLogin'})
            )
    );
    test('Check user ' + user + ' info', () =>
        request(app)
            .get('/users/info/' + user)
            .then((response: any) =>
                expect(response.body).toEqual({username: user, permissions: []})
            )
    );
});
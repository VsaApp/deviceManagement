import crypto from 'crypto';
import request from 'supertest';
import app from '../app';
import {hasPermission, permissions, permissionToString} from "../routes/permissons/permissions";

describe('Users', () => {
    let user = 'test';
    let password = crypto.createHash('sha256').update('123').digest('hex');
    let authStr = Buffer.from('admin:').toString('base64');

    // Adding users...
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

    // User information...
    test('Check user ' + user + ' info', () =>
        request(app)
            .get('/users/info/' + user)
            .then((response: any) =>
                expect(response.body).toEqual({username: user, permissions: []})
            )
    );

    // Deleting users...
    test('Delete user ' + user, () =>
        request(app)
            .get('/users/del/' + authStr + '/' + user)
            .then((response: any) =>
                expect(response.body).toEqual({status: 'DeletedUser'})
            )
    );
    test('User ' + user + ' is deleted', async () => {
        const response = await request(app).get('/users/info/' + user);
        expect(response.body).toEqual({error: 'NotExists'});
    });
    test('Delete not existing user ' + user, () =>
        request(app)
            .get('/users/del/' + authStr + '/' + user)
            .then((response: any) =>
                expect(response.body).toEqual({error: 'NotExists'})
            )
    );
    test('Delete admin user', () =>
        request(app)
            .get('/users/del/' + authStr + '/admin')
            .then((response: any) =>
                expect(response.body).toEqual({error: 'NotAllowed'})
            )
    );
    test('Cannot delete user ' + user + ' with invalid credentials', () =>
        request(app)
            .get('/users/del/INVALIDAUTH/' + user)
            .then((response: any) =>
                expect(response.body).toEqual({error: 'InvalidLogin'})
            )
    );

});
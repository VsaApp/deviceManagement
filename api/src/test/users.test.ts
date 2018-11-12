import crypto from 'crypto';
import request from 'supertest';
import app from '../app';
import auth from '../routes/users/auth';
import {
    addPermission,
    getPermissions,
    hasPermission,
    permissionExists,
    permissions,
    permissionToString,
    removePermission,
    stringToPermission
} from '../routes/users/permissions';

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
            request(app)
                .get('/users/login/' + authStr)
                .then((response: any) =>
                    expect(response.body).toEqual({status: 'Valid login'})
                );
            request(app)
                .get('/users/login/' + authStr + '123')
                .then((response: any) =>
                    expect(response.body).toEqual({status: 'Invalid login'})
                )
        });
        test('Extract username correctly', () => {
            expect(auth.getUsername(authStr)).toBe('admin');
        });
    });
    describe('Permissions', () => {
        test('Convert permissions correctly', () => {
            expect(permissionToString(permissions.ALL)).toEqual('ALL');
            expect(stringToPermission('ALL')).toEqual(permissions.ALL);
        });
        test('Check unknown permissions', () => {
            expect(permissionExists('ALL')).toBeTruthy();
            expect(permissionExists('123')).toBeFalsy();
        });
        test('User ' + user + ' has no permissions', async () => {
            expect(getPermissions(user)).toEqual([]);
            const response = await request(app).get('/users/info/' + user);
            expect(response.body.permissions).toEqual([]);
        });
        test('Add permission to user ' + user, async () => {
            expect(addPermission(user, permissions.ALL)).toBeUndefined();
            const response = await request(app).get('/users/permissions/add/' + authStr + '/' + user + '/ALL');
            expect(response.body).toEqual({status: 'Added permission'});
        });
        test('User ' + user + ' got permission', async () => {
            expect(hasPermission(user, permissions.ALL)).toBeTruthy();
            const response = await request(app).get('/users/info/' + user);
            expect(response.body.permissions).toEqual([permissionToString(permissions.ALL)]);
        });
        test('Remove permission from user ' + user, async () => {
            expect(removePermission(user, permissions.ALL)).toBeUndefined();
            const response = await request(app).get('/users/permissions/remove/' + authStr + '/' + user + '/ALL');
            expect(response.body).toEqual({status: 'Removed permission'});
        });
        test('User ' + user + ' got permission removed', () =>
            expect(hasPermission(user, permissions.ALL)).toBeFalsy()
        );
    });
});
import {
    addPermission,
    getPermissions,
    hasPermission,
    permissionExists,
    permissions,
    permissionToString,
    removePermission,
    stringToPermission
} from '../routes/permissons/permissions';
import request from 'supertest';
import app from '../app';
import crypto from "crypto";

let user = 'test';
let password = crypto.createHash('sha256').update('123').digest('hex');
let authStr = Buffer.from('admin:').toString('base64');

describe('Permissions', () => {
    test('Setup user ' + user, async () => {
        const response = await request(app).get('/users/add/' + authStr + '/' + user + '/' + password);
        expect(response.body).toEqual({status: 'CreatedUser'})
    });
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
        const response = await request(app).get('/permissions/add/' + authStr + '/' + user + '/ALL');
        expect(response.body).toEqual({status: 'AddedPermission'});
    });
    test('User ' + user + ' got permission', async () => {
        expect(hasPermission(user, permissions.ALL)).toBeTruthy();
        const response = await request(app).get('/users/info/' + user);
        expect(response.body.permissions).toEqual([permissionToString(permissions.ALL)]);
    });
    test('Remove permission from user ' + user, async () => {
        expect(removePermission(user, permissions.ALL)).toBeUndefined();
        const response = await request(app).get('/permissions/remove/' + authStr + '/' + user + '/ALL');
        expect(response.body).toEqual({status: 'RemovedPermission'});
    });
    test('User ' + user + ' got permission removed', () =>
        expect(hasPermission(user, permissions.ALL)).toBeFalsy()
    );
});
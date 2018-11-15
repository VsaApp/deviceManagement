import request from 'supertest';
import app from '../app';
import {getUsername, isValid} from '../routes/auth/auth';

let authStr = Buffer.from('admin:').toString('base64');
describe('Authentication', () => {
    test('Validates correctly', () => {
        expect(isValid(authStr)).toBeTruthy();
        expect(isValid(authStr + '123')).toBeFalsy();
    });
    test('Login working', () => {
        request(app)
            .get('/auth/login/' + authStr)
            .then((response: any) =>
                expect(response.body).toEqual({status: 'ValidLogin'})
            );
        request(app)
            .get('/auth/login/' + authStr + '123')
            .then((response: any) =>
                expect(response.body).toEqual({error: 'InvalidLogin'})
            )
    });
    test('Extract username correctly', () => {
        expect(getUsername(authStr)).toBe('admin');
    });
});
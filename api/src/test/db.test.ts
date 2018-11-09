import db from '../db';

describe('Database', () => {
    test('Default values set', () =>
        expect(db.get('users')).toEqual([{username: 'admin', password: '', permissions: []}])
    );
    test('Set a value', () =>
        expect(db.set('test', '123')).toBeUndefined()
    );
    test('Get a value', () =>
        expect(db.get('test')).toBe('123')
    );
    test('Delete a value', () =>
        expect(db.delete('test')).toBeUndefined()
    );
    test('Deleted value doesn\'t exist anymore', () =>
        expect(db.get('test')).toBeUndefined()
    );
});
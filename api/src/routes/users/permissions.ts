import db from '../../db';

const uniq = (arrArg: any) => arrArg.filter((elem: any, pos: number, arr: any[]) => arr.indexOf(elem) == pos);

export enum permissions {
    ALL,
    CHANGE_PERMISSIONS,
    CREATE_USER
}

export const addPermission = (username: string, permission: permissions) => {
    db.set('users', (db.get('users') || []).map((user: { username: string, permissions: string [] }) => {
        if (user.username === username) {
            user.permissions.push(permission.toString());
        }
        user.permissions = uniq(user.permissions);
        return user;
    }))
};

export const removePermission = (username: string, permission: permissions) => {
    db.set('users', (db.get('users') || []).map((user: { username: string, permissions: string [] }) => {
        if (user.username === username) {
            user.permissions.splice(user.permissions.indexOf(permission.toString()), 1);
        }
        return user;
    }))
};

export const getPermissions = (username: string) => {
    return (db.get('users') || []).filter((user: { username: string }) => user.username === username)[0].permissions;
};

export const hasPermission = (username: string, permission: permissions) => {
    return (db.get('users') || []).filter((user: { username: string, role: number }) => user.username === username)[0].permission.includes(permission.toString());
};
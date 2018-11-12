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
            user.permissions.push(permissionToString(permission));
        }
        user.permissions = uniq(user.permissions);
        return user;
    }))
};

export const removePermission = (username: string, permission: permissions) => {
    db.set('users', (db.get('users') || []).map((user: { username: string, permissions: string [] }) => {
        if (user.username === username) {
            user.permissions.splice(user.permissions.indexOf(permissionToString(permission)), 1);
        }
        return user;
    }))
};

export const getPermissions = (username: string) => {
    return (db.get('users') || []).filter((user: { username: string }) => user.username === username)[0].permissions;
};

export const hasPermission = (username: string, permission: permissions) => {
    const user = (db.get('users') || []).filter((user: { username: string, role: number }) => user.username === username)[0];
    return user.permissions.includes(permissionToString(permission)) || user.permissions.includes(permissionToString(permissions.ALL));
};

export const permissionToString = (permission: permissions) => {
    return permissions[permission];
};

export const stringToPermission = (permission: string) => {
    return (<any>permissions)[permission];
};

export const permissionExists = (permission: string) => {
    for (const k in permissions) if (permissions[k] == permission) return true;
    return false;
};
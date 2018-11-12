import fs from 'fs';
import path from 'path';
import {permissions, permissionToString} from "./routes/users/permissions";

const file = path.resolve(process.cwd(), 'db.json');

let data = {users: [{username: 'admin', password: '', permissions: [permissionToString(permissions.ALL)]}]};

if (process.env.MODE === 'prod') {
    if (!fs.existsSync(file)) {
        fs.writeFileSync(file, JSON.stringify(data));
    } else {
        data = JSON.parse(fs.readFileSync(file).toString());
    }

}

const db = {
    set: (key: string, value: any) => {
        (<any>data)[key] = value;
        if (process.env.MODE === 'prod') {
            fs.writeFileSync(file, JSON.stringify(data));
        }
    },
    get: (key: string) => {
        return (<any>data)[key];
    },
    delete: (key: string) => {
        delete (<any>data)[key];
        if (process.env.MODE === 'prod') {
            fs.writeFileSync(file, JSON.stringify(data));
        }
    }
};

export default db;
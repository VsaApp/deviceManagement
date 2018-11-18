import express from 'express';
import cors from 'cors';
import {usersRouter} from './routes/users/users';
import {permissionsRouter} from './routes/permissons/permissions';
import {authRouter} from './routes/auth/auth';
import {devicesRouter} from './routes/devices/devices';
import {importZuludeskDevices} from './providers/devices/zuludesk';
import db from './db';

const app = express();

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello!');
});

app.use('/users', usersRouter);
app.use('/permissions', permissionsRouter);
app.use('/auth', authRouter);
app.use('/devices', devicesRouter);

importAllDevices();
setInterval(importAllDevices, 60000);

function importAllDevices() {
    importZuludeskDevices().then(devices => {
        overwriteDevices(devices);
    }).catch(msg => {
        console.error(msg);
    });
}

function overwriteDevices(devices: any) {
    db.set('devices', devices.map((d: { id: string }) => {
        if ((db.get('devices') || []).filter((device: { id: string }) => d.id === device.id).length === 1) {
            if (JSON.stringify(d) !== JSON.stringify((db.get('devices') || []).filter((device: { id: string }) => d.id === device.id)[0])) {
                console.log('Updated device ' + d.id);
                return devices.filter((device: { id: string }) => d.id === device.id)[0];
            }
        }
        return d;
    }));
}

export default app;
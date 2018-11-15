import express from 'express';
import cors from 'cors';
import {usersRouter} from './routes/users/users';
import {permissionsRouter} from './routes/permissons/permissions';
import {authRouter} from './routes/auth/auth';
import {devicesRouter} from './routes/devices/devices';

const app = express();

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello!');
});

app.use('/users', usersRouter);
app.use('/permissions', permissionsRouter);
app.use('/auth', authRouter);
app.use('/devices', devicesRouter);

export default app;
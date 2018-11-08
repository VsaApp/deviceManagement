import express from 'express';
import cors from 'cors';
import users from './routes/users/users';

const app = express();

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello!');
});

app.use('/users', users);

export default app;
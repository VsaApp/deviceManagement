import app from './app';

app.listen(process.env.PORT || 8000, () => {
    console.log('Listening on *:' + (process.env.PORT || 8000));
});
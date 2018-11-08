import db from '../../db';

const auth = {
    isValid: (authStr: string) => {
        return (db.get('users') || [])
            .map((user: { username: string, password: string }) => {
                return Buffer.from(user.username + ':' + user.password).toString('base64');
            }).filter((user: string) => user === authStr).length === 1;
    }
};

export default auth;
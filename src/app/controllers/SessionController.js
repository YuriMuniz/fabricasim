import 'dotenv/config';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';

class SessionController {
    async store(req, res) {
        const { userName, password } = req.body;

        const instance = await axios.create({
            baseURL: process.env.APP_URL_API,
            timeout: 2000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const user = await instance
            .post('/angular/login', { userName, password })
            .catch((error) => {
                if (error.response === undefined) {
                    return res
                        .status(403)
                        .json({ error: 'User or password don´t match.' });
                }
                if (error.response.status === 403) {
                    return res
                        .status(401)
                        .json({ error: 'User or password don´t match.' });
                }
                return res.json({ error: 'Server does not respond.' });
            });

        const {
            id,
            email,
            name,
            occupation,
            country,
            state,
            roles,
        } = user.data;

        return res.json({
            user: {
                id,
                email,
                name,
                occupation,
                country,
                state,
                roles,
            },
            token: jwt.sign({ id }, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            }),
        });
    }
}

export default new SessionController();

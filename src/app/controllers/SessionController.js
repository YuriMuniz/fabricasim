import 'dotenv/config';
import axios from 'axios';

import jwt from 'jsonwebtoken';

class SessionController {
    async store(req, res) {
        const { userName, password } = req.body;

        const instance = await axios.create({
            baseURL: process.env.APP_URL_API,
            timeout: 1000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const user = await instance
            .post('/angular/login', { userName, password })
            .catch((error) => {
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
            token: jwt.sign({ id }, process.env.APP_SECRET, {
                expiresIn: '7d',
            }),
        });

        // const user = await User.findOne({ where: { email } });

        // if (!user) {
        //     return res.status(401).json({ error: 'User not found' });
        // }
    }
}

export default new SessionController();

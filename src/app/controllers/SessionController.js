import 'dotenv/config';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';
import UserProfiles from '../models/UserProfiles';

class SessionController {
    async store(req, res) {
        const { email, password } = req.body;

        const instance = await axios.create({
            baseURL: process.env.APP_URL_API,

            headers: {
                'Content-Type': 'application/json',
            },
        });

        const user = await instance
            .post('/angular/login', { userName: email, password })
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

                return res.json({ erro: error });
            });

        const userReturn = await UserProfiles.findByPk(user.data.id);

        const {
            id,
            userFirstName,
            userOccupation,
            userCellNumber,
            userCountry,
            userState,
        } = userReturn;

        return res.json({
            user: {
                id,
                email,
                name: userFirstName,
                occupation: userOccupation,
                cellNumber: userCellNumber,
                country: userCountry,
                state: userState,
                roles: user.data.roles,
            },
            token: jwt.sign({ id }, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            }),
        });
    }
}

export default new SessionController();

import 'dotenv/config';

import axios from 'axios';

class UserController {
    async store(req, res) {
        const {
            email,
            occupation,
            cellNumber,
            country,
            state,
            password,
        } = req.body;

        const instance = await axios.create({
            baseURL: process.env.APP_URL_API,
            timeout: 1000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const user = await instance
            .post('/angular/register', {
                email,
                occupation,
                cellNumber,
                country,
                state,
                password,
            })
            .catch((error) => {
                return res.json({ error: 'Server error.', erro: error });
            });
        if (user.data !== '') {
            if (user.data[0] === `Name ${email} is already taken.`) {
                return res
                    .status(400)
                    .json({ error: `Name ${email} is already taken.` });
            }
        }

        return res.json({ success: 'User has been registred.' });
    }
}

export default new UserController();

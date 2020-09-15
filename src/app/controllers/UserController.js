import 'dotenv/config';

import axios from 'axios';

import * as Yup from 'yup';
import UserProfiles from '../models/UserProfiles';

class UserController {
    async store(req, res) {
        const {
            name,
            email,
            occupation,
            cellNumber,
            country,
            state,
            password,
        } = req.body;

        const instance = await axios.create({
            baseURL: process.env.APP_URL_API,

            headers: {
                'Content-Type': 'application/json',
            },
        });

        const user = await instance
            .post('/angular/register', {
                name,
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

        return res.status(200).json(user.data[0]);
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string(),
            occupation: Yup.string(),
            cellNumber: Yup.number(),
            country: Yup.string(),
            state: Yup.string(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const data = {
            userFirstName: req.body.name,
            userOcuppation: req.body.ocuppation,
            userCellNumber: req.body.cellNumber,
            userCountry: req.body.country,
            userState: req.body.state,
        };

        const user = await UserProfiles.findByPk(req.userId);

        await user.update(data);

        const {
            userFirstName,
            userOcuppation,
            userCellNumber,
            userCountry,
            userState,
        } = await UserProfiles.findByPk(req.userId);

        return res.json({
            userFirstName,
            userOcuppation,
            userCellNumber,
            userCountry,
            userState,
        });
    }
}

export default new UserController();

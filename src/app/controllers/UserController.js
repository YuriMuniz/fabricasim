import 'dotenv/config';

import axios from 'axios';

import * as Yup from 'yup';
import UserProfiles from '../models/UserProfiles';
import ApplicationUsers from '../models/ApplicationUsers';

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
                const u = await ApplicationUsers.findOne({
                    where: {
                        email,
                    },
                });

                return res.status(400).json({
                    error: `Name ${email} is already taken.`,
                    id: u.userProfileId,
                });
            }
        }

        const userApp = await ApplicationUsers.findOne({
            where: {
                email,
            },
        });
        // console.log(userApp);
        const newUser = await UserProfiles.findOne({
            where: {
                id: userApp.userProfileId,
            },
        });

        return res.status(200).json(newUser);
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

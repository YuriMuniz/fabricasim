import Sequelize from 'sequelize';
import FabricoinFlowPortalRecords from '../models/FabricoinFlowPortalRecords';
import FabricoinGiftPortalRecords from '../models/FabricoinGiftPortalRecords';
import UserProfiles from '../models/UserProfiles';
import Groups from '../models/Groups';

class FabricoinController {
    async storeFabricoinInUser(req, res) {
        const { amount, userProfileId } = req.body;

        const user = await UserProfiles.findOne({
            where: {
                id: userProfileId,
            },
        });
        console.log(user);
        if (!user) {
            return res.status(403).json({ message: 'User not found.' });
        }

        const ff = {
            fabricoinSource: 1,
            timestamp: Sequelize.fn('GETDATE'),
            isActive: true,
            fabricoinAmount: amount,
            userProfile_Id: userProfileId,
        };
        try {
            const f = await FabricoinFlowPortalRecords.create(ff);
            const fg = {
                fabricoinFlow_Id: f.id,
                timestamp: Sequelize.fn('GETDATE'),
                isActive: true,
                userProfile_Id: req.userId,
            };
            await FabricoinGiftPortalRecords.create(fg);
        } catch (err) {
            return res.json(err);
        }

        const fabricoinBalance = user.fabricoinBalance + amount;
        const userUpdate = {
            fabricoinBalance,
        };
        const userNewBalance = await user.update(userUpdate);
        return res.json(userNewBalance);
    }

    async storeFabricoinInUsersOfGroup(req, res) {
        const { amount, idGroup } = req.body;

        const group = await Groups.findOne({
            where: {
                id: idGroup,
            },
            include: [
                {
                    model: UserProfiles,
                    as: 'users',
                    attributes: ['id', 'fabricoinBalance'],
                    through: {
                        attributes: [],
                    },
                },
            ],
        });

        console.log(group);

        await group.users.forEach(async (user) => {
            const fabricoinFlow = {
                fabricoinSource: 1,
                timestamp: Sequelize.fn('GETDATE'),
                isActive: true,
                fabricoinAmount: amount,
                userProfile_Id: 0,
            };
            fabricoinFlow.userProfile_Id = user.id;

            const f = await FabricoinFlowPortalRecords.create(fabricoinFlow);
            const fabricoinGift = {
                fabricoinFlow_Id: f.id,
                timestamp: Sequelize.fn('GETDATE'),
                isActive: true,
                userProfile_Id: req.userId,
            };
            await FabricoinGiftPortalRecords.create(fabricoinGift);
        });

        await group.users.forEach(async (user) => {
            const fabricoinBalance = user.fabricoinBalance + amount;
            const userUpdate = {
                fabricoinBalance,
            };

            await user.update(userUpdate);
        });

        return res.json(group);
    }
}

export default new FabricoinController();

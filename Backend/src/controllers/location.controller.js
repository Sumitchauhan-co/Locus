import locationModel from '../models/location.model.js';

const getLocation = async (req, res) => {
    try {
        const { lat, lng } = req.query;

        if (lat === undefined || lng === undefined) {
            return res
                .status(400)
                .json({ message: 'location coordinates are required' });
        }

        const latitude = Number(lat);
        const longitude = Number(lng);

        if (isNaN(latitude) || isNaN(longitude)) {
            return res.status(400).json({ message: 'Invalid coordinates' });
        }

        const radius = 5000;

        const users = await locationModel
            .find({
                location: {
                    $near: {
                        $geometry: {
                            type: 'Point',
                            coordinates: [longitude, latitude],
                        },
                        $maxDistance: radius,
                    },
                },
            })
            .select('userId name location');

        const usersData = await locationModel.find({});

        const formattedUsers = users.map((user) => ({
            id: user.userId,
            name: user.name,
            lat: user.location.coordinates[1],
            lng: user.location.coordinates[0],
        }));

        return res.status(200).json(formattedUsers);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const updateLocation = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { lat, lng } = req.body;

        if (!userId || lat === undefined || lng === undefined) {
            return res.status(400).json({ mesage: 'Fields missing' });
        }

        if (!userId || lat === undefined || lng === undefined) {
            return res.status(400).json({ message: 'Invalid coordinates' });
        }

        const latitude = Number(lat);
        const longitude = Number(lng);

        const userLocation = await locationModel.findOneAndUpdate(
            { userId },
            {
                userId,
                name: req.user.username,
                location: {
                    type: 'Point',
                    coordinates: [longitude, latitude],
                },
                updatedAt: new Date(),
            },
            {
                returnDocument: 'after',
                upsert: true,
            },
        );

        return res.status(200).json({
            message: 'User location updated successfully',
            data: userLocation,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

export default { updateLocation, getLocation };

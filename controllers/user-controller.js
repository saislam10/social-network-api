
// // post a new user
// // PUT to update a user by its id
// // DELETE to remove user by its id
// // BONUS: Remove a user's associated thoughts when deleted.

// /api/users/:userId/friends/:friendId

// // POST to add a new friend to a user's friend list

// // DELETE to remove a friend from a user's friend list

const { User } = require('../models');

// /api/users
module.exports = {
    // create a new User
    createUser(req, res) {
        if (req.body.userId) {
            User.create(req.body)
                .then((User) => {
                    return User.findOneAndUpdate(
                        { _id: req.body.userId },
                        { $addToSet: { Users: User._id } },
                        { new: true }
                    );
                })
                .then((user) =>
                    !user
                        ? res.status(404).json({
                            message: 'User created, but found no user with that ID',
                        })
                        : res.json('Created the User 🎉')
                )
                .catch((err) => {
                    console.log(err);
                    return res.status(500).json(err);
                });
        } else {
            return res.status(404).json({ message: 'userId not provided!' });
        }
    },
    // // get all users
    getUsers(req, res) {
        User.find()
            .then((Users) => res.json(Users))
            .catch((err) => res.status(500).json(err));
    },
    // // get a single user by id and populated thought and friend data
    getSingleUserById(req, res) {
        User.findOne({ _id: req.params.UserId })
            .populate({ path: 'thoughts' })
            .populate({ path: 'friends' })
            .select('-__v')
            .then((User) =>
                !User
                    ? res.status(404).json({ message: 'No User with that ID' })
                    : res.json(User)
            )
            .catch((err) => res.status(500).json(err));
    },
    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.UserId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((User) =>
                !User
                    ? res.status(404).json({ message: 'No User with this id!' })
                    : res.json(User)
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },
    deleteUser(req, res) {
        User.findOneAndRemove({ _id: req.params.UserId })
            .then((User) =>
                !User
                    ? res.status(404).json({ message: 'No User with this id!' })
                    : User.findOneAndUpdate(
                        { Users: req.params.UserId },
                        { $pull: { Users: req.params.UserId } },
                        { new: true }
                    )
            )
            .then((user) =>
                !user
                    ? res.json({ message: 'User deleted but no user with this id!' })
                    : res.json({ message: 'User successfully deleted from user!' })
            ).catch((err) => res.status(500).json(err));
    },

};

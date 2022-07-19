
// // post a new user
// // PUT to update a user by its id
// // DELETE to remove user by its id
// // BONUS: Remove a user's associated thoughts when deleted.

// /api/users/:userId/friends/:friendId

// // POST to add a new friend to a user's friend list

// // DELETE to remove a friend from a user's friend list

const { user } = require('../models');

// /api/users
module.exports = {
    // create a new user
    createuser(req, res) {
        if (req.body.userId) {
            user.create(req.body)
                .then((user) => {
                    return user.findOneAndUpdate(
                        { _id: req.body.userId },
                        { $addToSet: { users: user._id } },
                        { new: true }
                    );
                })
                .then((user) =>
                    !user
                        ? res.status(404).json({
                            message: 'user created, but found no user with that ID',
                        })
                        : res.json('Created the user 🎉')
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
    getusers(req, res) {
        user.find()
            .then((users) => res.json(users))
            .catch((err) => res.status(500).json(err));
    },
    // // get a single user by id and populated thought and friend data
    getSingleuserById(req, res) {
        user.findOne({ _id: req.params.userId })
            .populate({ path: 'thoughts' })
            .populate({ path: 'friends' })
            .select('-__v')
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No user with that ID' })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
    updateuser(req, res) {
        user.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No user with this id!' })
                    : res.json(user)
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },
    deleteuser(req, res) {
        user.findOneAndRemove({ _id: req.params.userId })
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No user with this id!' })
                    : user.findOneAndUpdate(
                        { users: req.params.userId },
                        { $pull: { users: req.params.userId } },
                        { new: true }
                    )
            )
            .then((user) =>
                !user
                    ? res.json({ message: 'user deleted but no user with this id!' })
                    : res.json({ message: 'user successfully deleted from user!' })
            ).catch((err) => res.status(500).json(err));
    },

};

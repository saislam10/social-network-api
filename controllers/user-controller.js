
// /api/users

// POST a new user: 
// example data
// {
//     "username": "lernantino",
//     "email": "lernantino@gmail.com"
//   } - Done

// GET all users - Done 

// GET a single user by its _id and populated thought and friend data - Done


// PUT to update a user by its _id - Done

// DELETE to remove user by its _id - Done

// Remove a user's associated thoughts when deleted. - Do this

// /api/users/:userId/friends/:friendId

// // POST to add a new friend to a user's friend list - Do this

// // DELETE to remove a friend from a user's friend list - Do this

const { user, thought } = require('../models');

// /api/users
module.exports = {
    // create a new user
    createUser(req, res) {
        user.create(req.body)
          .then((user) => res.json(user))
          .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
          });
      },

    // // get all users
    getUsers(req, res) {
        user.find({})
            .then((users) => res.json(users))
            .catch((err) => res.status(500).json(err));
    },
    // // get a single user by id and populated thought and friend data
    getSingleUserById(req, res) {
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
    // Update user by ID
    updateUserById(req, res) {
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
    deleteUserById(req, res) {
        user.findOneAndRemove({ _id: req.params.userId })
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No user with this id!' })
                    : thought.deleteMany({ _id: { $in: user.thought } })
            )
            .then((user) =>
                !user
                    ? res.json({ message: 'user deleted but no thought with this id!' })
                    : res.json({ message: 'user and thought deleted!' })
            ).catch((err) => res.status(500).json(err));
    },
    updateFriendById(req, res) {
        user.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        )
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No user found with this id!' })
                    : res.json(user)
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    deleteFriendById(req, res) {
        user.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { new: true }
        )
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No user found with this id!' })
                    : res.json(user)
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
        },
};

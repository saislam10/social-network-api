const router = require('express').Router();
const {
    createUser,
    getUsers,
    getSingleUserById,
    updateUserById,
    deleteUserById,
    updateFriendById,
    deleteFriendById
} = require('../../controllers/user-controller');

router.route('/').get(getUsers).post(createUser);

router.route('/:userId')
    .get(getSingleUserById)
    .put(updateUserById)
    .delete(deleteUserById);

router.route('/:userId/friends/:friendId')
    .post(updateFriendById)
    .delete(deleteFriendById);

module.exports = router;
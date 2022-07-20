const router = require('express').Router();
const {
    createThought,
    getThoughts,
    getSingleThoughtById,
    updateThoughtById,
    deleteThoughtById,
    updateReactionById,
    deleteReactionById
} = require('../../controllers/thought-controller');

router.route('/').get(getThoughts).post(createThought);

router.route('/:thoughtId')
    .get(getSingleThoughtById)
    .put(updateThoughtById)
    .delete(deleteThoughtById);

router.route('/:thoughtId/reactions')
    .post(updateReactionById)

router.route('/:thoughtId/reactions/:reactionId')
    .delete(deleteReactionById);

module.exports = router;
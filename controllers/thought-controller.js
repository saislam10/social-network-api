// /api/thoughts
// // POST to create a new thought (don't forget to push the created thought's _id to the associated thought's thoughts array field) - Done
// // GET to get all thoughts - Done 
// // GET to get a single thought by its _id - Done 
// // PUT to update a thought by its _id - Done 
// // DELETE to remove a thought by its _id - Done

// /api/thoughts/:thoughtId/reactions
// // POST to create a reaction stored in a single thought's reactions array field - Done 
// // DELETE to pull and remove a reaction by the reaction's reactionId value - Done

const { thought, user } = require('../models');
module.exports = {
    // create a new thought
    createThought(req, res) {
        if (req.body.thoughtId) {
            thought.create(req.body)
                .then(({ _id }) => {
                    return user.findOneAndUpdate(
                        { _id: req.body.thoughtId },
                        { $addToSet: { thoughts: _id } },
                        { new: true }
                    );
                })
                .then((thought) =>
                    !thought
                        ? res.status(404).json({
                            message: 'thought created, but found no thought with that ID',
                        })
                        : res.json('Created the thought 🎉')
                )
                .catch((err) => {
                    console.log(err);
                    return res.status(500).json(err);
                });
        } else {
            return res.status(404).json({ message: 'thoughtId not provided!' });
        }
    },
    // // get all thoughts
    getThoughts(req, res) {
        thought.find({})
            .then((thoughts) => res.json(thoughts))
            .catch((err) => res.status(500).json(err));
    },
    // // get a single thought by id and populated thought and friend data
    getSingleThoughtById(req, res) {
        thought.findOne({ _id: req.params.thoughtId })
            .select('-__v')
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No thought with that ID' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
    // update thought by ID
    updateThoughtById(req, res) {
        thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: req.body },
            { runValidators: true, new: true }
        )
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No thought with this id!' })
                    : res.json(thought)
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },
    // delete thought by ID
    deleteThoughtById(req, res) {
        thought.findOneAndRemove({ _id: req.params.thoughtId })
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No thought with this id!' })
                    : thought.findOneAndUpdate(
                        { thoughts: req.params.thoughtId },
                        { $pull: { thoughts: req.params.thoughtId } },
                        { new: true }
                    )
            )
            .then((user) =>
                !user
                    ? res.json({ message: 'thought deleted but no user with this id!' })
                    : res.json({ message: 'thought successfully deleted from thought!' })
            ).catch((err) => res.status(500).json(err));
    },
    updateReactionById(req, res) {
        user.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
        )
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No thought found with this id!' })
                    : res.json(user)
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    deleteReactionById(req, res) {
        user.findOneAndDelete(
            { _id: req.params.userId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { runValidators: true, new: true }
        )
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No thought found with this id!' })
                    : res.json(user)
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
        },
};

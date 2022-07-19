// /api/thoughts
// // GET to get all thoughts
// // GET to get a single thought by its _id
// // POST to create a new thought (don't forget to push the created thought's _id to the associated thought's thoughts array field)
// // PUT to update a thought by its _id
// // DELETE to remove a thought by its _id

// /api/thoughts/:thoughtId/reactions
// // POST to create a reaction stored in a single thought's reactions array field
// // DELETE to pull and remove a reaction by the reaction's reactionId value
const { thought } = require('../models');
module.exports = {
    // create a new thought
    createthought(req, res) {
        if (req.body.thoughtId) {
            thought.create(req.body)
                .then((thought) => {
                    return thought.findOneAndUpdate(
                        { _id: req.body.thoughtId },
                        { $addToSet: { thoughts: thought._id } },
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
    getthoughts(req, res) {
        thought.find()
            .then((thoughts) => res.json(thoughts))
            .catch((err) => res.status(500).json(err));
    },
    // // get a single thought by id and populated thought and friend data
    getSinglethoughtById(req, res) {
        thought.findOne({ _id: req.params.thoughtId })
            .populate({ path: 'thoughts' })
            .populate({ path: 'friends' })
            .select('-__v')
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No thought with that ID' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
    updatethought(req, res) {
        thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
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
    deletethought(req, res) {
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
            .then((thought) =>
                !thought
                    ? res.json({ message: 'thought deleted but no thought with this id!' })
                    : res.json({ message: 'thought successfully deleted from thought!' })
            ).catch((err) => res.status(500).json(err));
    },

};

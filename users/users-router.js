const router = require("express").Router();

const Users = require("./users-model.js");

router.get("/", (req, res) => {
    Users.find()
        .then(users => {
            res.status(200).json({ data: users });
        })
        .catch(err => res.send({ message: "you shall not pass!"}));
});

module.exports = router;

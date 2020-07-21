const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Users = require('../users/users-model')

const router = require("express").Router();

router.post("/register", (req, res) => {
    const credentials = req.body

    if(credentials){
        const rounds = process.env.BCRYPT_ROUNDS || 4;

        const hash = bcryptjs.hashSync(credentials.password, rounds);

        credentials.password = hash 

        Users.add(credentials)
        .then(user => {
            const token = makeJwt(user)

            res.status(201).json({ data: user, token})
        })
        .catch(error => {
            res.status(500).json({ message: error.message});
        });
    } else {
        res.status(400).json({
            message: "please provide username and password and the password should be alphanumeric",
        });
    }
})

router.post("/login", (req, res) => {
    const {username, password} = req.body;
    if(req.body){
        Users.findBy({ username: username})
            .then(([user]) => {
                if( user && bcryptjs.compareSync(password, user.password)) {
                    const token = makeJwt(user);

                    res.status(200).json({ message: "welcome in!", token});
                } else {
                    res.status(401).json({ message: "invalid credentials"})
                }
            })
            .catch(error => {
                res.status(500).json({ message: error.message})
            });
    } else {
        res.status(400).json({
            message: "please provide username and password",
        })
    }
})

// define makeJwt function 

function makeJwt(user) {
    const payload = {
        subject: user.id,
        username: user.username,
        role: user.role,
    };

    const secret = process.env.JWT_SECRET || "is it secret, is it safe?";

    const options = {
        expiresIn: "1h",
    };

    return jwt.sign(payload, secret, options);
}


module.exports = router; 
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./dataaccess/users');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
    res.send("Server is up!");
});

server.post('/api/register', (req, res) => {
    let user = req.body;
    if (user.username && user.password) {
        const hash = bcrypt.hashSync(user.password,4);
        user.password = hash;
        db.add(user)
        .then(saved => {
            res.status(201).json(saved);
        })
        .catch(err => {
            res.status(500).json(error);
        })
    }
})

server.post('/api/login', (req, res) => {
    let user = req.body;
    if (user.username && user.password) {
        db.findBy({username: user.username})
        .first()
        .then(info => {
            if (info && bcrypt.compareSync(user.password, info.password)) {
                res.status(200).json({message: `Welcome ${info.username}`})
            } else {
                res.status(401).json({message: "Invalid credentials"})
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err);
        })
    } else {
        res.status(400).json({message: "Please give a username and password"})
    }
})

const port = 5000;
server.listen(port, () => console.log(`server running on port ${port}`))
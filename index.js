const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./dataaccess/users');
const dbconfig = require('./dbConfig.js');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const server = express();

const sessionConfig = {
    name: 'delectable',
    secret: 'find out what is even going on',
    cookie: {
        maxAge: 1000 * 60 * 120,
        secure: false // it's fine to use over http for dev
    },
    httpOnly: true, //no peeking into it from JS console
    resave: false,
    saveUninitialized: false,

    store: new KnexSessionStore({
        knex: dbconfig,
        tablename: 'sessions',
        sidfieldname: 'sid',
        createtable: true,
        clearInterval: 1000 * 60 * 120,
    })
}

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

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
            req.session.user = saved;
            res.status(201).json(saved);
        })
        .catch(err => {
            res.status(500).json({message: "Duplicate username"});
        })
    }
})

server.post('/api/login', (req, res) => {
    let user = req.body;
    if (user.username && user.password) {
        db.findBy({"username": user.username})
        .first()
        .then(info => {
            if (info && bcrypt.compareSync(user.password, info.password)) {
                req.session.user = user;
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

function restricted(req, res, next) {
    if (req.session && req.session.user) {
        next();
    } else {
        res.status(401).json({message: "Access to restricted area prohibited."})
    }
}

server.get('/api/users', restricted, (req, res) => {
    db.find()
    .then(users => {
        res.json(users);
    })
    .catch(err => res.send(err));
})

server.get('/api/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                console.log(err)
            } else {
                res.send('Goodbye!')
            }
        })
    } else {
        res.end();
    }
})

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server running on port ${port}`))
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./dataaccess/users');
const session = require('express-session')
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

function restricted(req, res, next) {
    let { username, password } = req.headers;
  
    if (username && password) {
      db.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          next();
        } else {
          res.status(401).json({ message: 'Invalid Credentials' });
        }
      })
      .catch(error => {
          console.log(error)
        res.status(500).json({message: "No credentials provided."});
      });
    } else {
      res.status(400).json({message:"No credentials provided."});
    }
  }

server.get('/api/users', restricted, (req, res) => {
    db.find()
    .then(users => {
        res.json(users);
    })
    .catch(err => res.send(err));
})
const port = 5000;
server.listen(port, () => console.log(`server running on port ${port}`))
# Authentication Project

## Topics

- Authentication.
- Express Middleware.
- Password Hashing.
- Sessions
- Cookies

## Description
Use `Node.js`, `Express` and `Knex` to build an API that provides **Register** and **Login** functionality using `SQLite` to store _User_ information. Make sure the password is not stored as plain text.

You will build the solution from scratch, no starter code is provided. Feel free to structure your API anyway you want, but aim at making it easy to maintain in the future.

## Assignment

### Design and build the following endpoints:

| Method | Endpoint      | Description                                                                                                                                                                                                                                                                                 |
| ------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | /api/register | Creates a `user` using the information sent inside the `body` of the request. **Hash the password** before saving the user to the database.                                                                                                                                                 |
| POST   | /api/login    | Use the credentials sent inside the `body` to authenticate the user. On successful login, create a new session for the user and send back a 'Logged in' message and a cookie that contains the user id. If login fails, respond with the correct status code and the message: 'You shall not pass!' |
| GET    | /api/users    | If the user is logged in, respond with an array of all the users contained in the database. If the user is not logged in repond with the correct status code and the message: 'You shall not pass!'.            |

### After we cover the lecture on **sessions** and **cookies**, use them to keep a record of logged in users across requests.

## Notes for self

To implement sessions, I had to:

1. yarn add express-session, a middleware that allows storing of sessions, and yarn add connect-session-knex, a middleware that allows connecting a session to the database (managed by knex)
2. I declared a variable KnexSessionStore, imported connect-session-knex, and curried the session variable from express-session into it. 
3. I set up my sessionConfig and a new KnexSessionStore in my sessionConfig.
Looked like this:

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

4. Made sure to server.use(session(sessionConfig))
5. After a user registers, I save the id of the user into req.session.user. Not clear on if this is necessary.
6. At login, I save the user info into req.session.user if the user and pw pass. 
7. I set up a way to logout, with a GET request to the endpoint. This uses req.session.destroy, which contains a callback for any potential errors. 



## Stretch Problem

- Write a piece of **global** middleware that ensures a user is logged in when accessing _any_ route prefixed by `/api/restricted/`. For instance, `/api/restricted/something`, `/api/restricted/other`, and `/api/restricted/a` should all be protected by the middleware; only logged in users should be able to access these routes.
- Build a React application that implements components to register, login and view a list of users. Gotta keep sharpening your React skills.

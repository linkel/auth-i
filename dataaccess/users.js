const db = require('../dbConfig.js');

module.exports = {
  add,
  find,
  findBy,
  findById,
};

function find() {
  return db('users').select('id', 'username', 'password');
}

function findBy(filter) {
  return db('users').where(filter);
}

function add(user) { //gotta make sure you return the promise
  return db('users').insert(user)
  .then(result => {
      console.log(result)
      const [id] = result
      return findById(id)
  })
  .catch(err => {
      console.log(err)
  })
}

function findById(id) {
  return db('users')
    .where({ id })
    .first();
}

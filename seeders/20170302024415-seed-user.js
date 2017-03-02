'use strict';

const bcrypt = require('bcrypt');
const saltRounds = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync('password', saltRounds);

let adminUser = [{
              username: "admin",
              password: hash,
              createdAt: new Date(),
              updatedAt: new Date()
                }];


module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users',adminUser);

  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', adminUser);

  }
};
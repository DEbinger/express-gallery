module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    user: DataTypes.STRING,
  }, {
    classMethods: {
      // associate: function(models)
      // }
    }
  });

  return User;
};
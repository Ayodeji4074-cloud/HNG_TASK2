const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql'
});

const User = require('./user')(sequelize);
const Organisation = require('./organisation')(sequelize);

User.belongsToMany(Organisation, { through: 'UserOrganisations' });
Organisation.belongsToMany(User, { through: 'UserOrganisations' });

sequelize.sync({ force: true }).then(() => {
  console.log('Database & tables created!');
});

module.exports = {
  sequelize,
  User,
  Organisation
};

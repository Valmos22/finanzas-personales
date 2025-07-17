import { Sequelize } from 'sequelize';

const db = new Sequelize('backend_api', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})

export default db;
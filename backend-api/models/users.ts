import { DataTypes } from "sequelize";
import db from "../database/connection";

const User = db.define('users', {

    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    imagen: {
        type: DataTypes.STRING,
        allowNull: true
    },
    estado: {
        type: DataTypes.BOOLEAN
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false
    }
},{
  tableName: 'users'
});

export default User;
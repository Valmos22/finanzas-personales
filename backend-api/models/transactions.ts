import { DataTypes } from "sequelize";
import db from "../database/connection";
import User from "./users";

const Transaction = db.define('transactions', {
    id: { 
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true 
    },
    userId: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    type: { 
        type: DataTypes.ENUM('income', 'expense'), 
        allowNull: false 
    },
    category: { 
        type: DataTypes.STRING 
    },
    amount: { 
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: false 
    },
    date: { 
        type: DataTypes.DATEONLY, 
        allowNull: false 
    },
    description: { 
        type: DataTypes.STRING 
    }
}, {
    tableName: 'transactions',
    timestamps: false
});

Transaction.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Transaction, { foreignKey: 'userId' });

export default Transaction;


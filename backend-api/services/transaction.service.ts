import { Op } from 'sequelize';
import Transaction from '../models/transactions';

export const createTransaction = (data: any) => Transaction.create(data);

export const getTransactions = async (query: any, page: number, limit: number) => {
    const where: any = {};

    if (query.userId) where.userId = query.userId;
    if (query.type) where.type = query.type;
    if (query.category) where.category = query.category;
    if (query.fromDate || query.toDate) {
        where.date = {};
        if (query.fromDate) where.date[Op.gte] = query.fromDate;
        if (query.toDate) where.date[Op.lte] = query.toDate;
    }

    const offset = (page - 1) * limit;

    return await Transaction.findAndCountAll({
        where,
        offset,
        limit,
        order: [['date', 'DESC']],
    });
};

export const getTransactionsByUser = (userId: number) => 
    Transaction.findAll({ where: { userId } });

export const getTransactionById = (id: number) => 
    Transaction.findByPk(id);

export const updateTransaction = async (id: number, updates: any) => {
    const transaction = await getTransactionById(id);
    if (!transaction) return null;
    return await transaction.update(updates);
};

export const deleteTransaction = async (id: number) => {
    const transaction = await getTransactionById(id);
    if (!transaction) return null;
    await transaction.destroy();
    return transaction;
};

export const getSummary = (userId: number) => {
    return Transaction.findAll({
        where: { userId },
        attributes: [
            'type',
            'category',
            [Transaction.sequelize!.fn('SUM', Transaction.sequelize!.col('amount')), 'totalAmount'],
            [Transaction.sequelize!.fn('COUNT', Transaction.sequelize!.col('id')), 'count'],
        ],
        group: ['type', 'category'],
    });
};


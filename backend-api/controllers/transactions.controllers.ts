import { Request, Response } from 'express';
import * as TransactionService from '../services/transaction.service';
import * as CSVUtil from '../utils/exportToCSV';
import { error, success } from '../utils/response';

export const createTransaction = async (req: Request, res: Response) => {
    try {
        const transaction = await TransactionService.createTransaction(req.body);
        success(res, transaction, 201);
    } catch (err) {
        error(res, 'Error al crear transacción', err);
    }
};

export const getAllTransactions = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const result = await TransactionService.getTransactions(req.query, Number(page), Number(limit));
        success(res, {
            transactions: result.rows,
            total: result.count,
            page: Number(page),
            pages: Math.ceil(result.count / Number(limit))
        });
    } catch (err) {
        error(res, 'Error al obtener transacciones', err);
    }
};

export const getTransactionById = async (req: Request, res: Response) => {
    try {
        const transactions = await TransactionService.getTransactionsByUser(Number(req.params.userId));
        if (!transactions.length) return res.status(404).json({ message: 'No se encontraron transacciones' });
        success(res, transactions);
    } catch (err) {
        error(res, 'Error al obtener transacciones', err);
    }
};

export const updateTransaction = async (req: Request, res: Response) => {
    try {
        const updated = await TransactionService.updateTransaction(Number(req.params.id), req.body);
        if (!updated) return res.status(404).json({ message: 'Transacción no encontrada' });
        success(res, updated);
    } catch (err) {
        error(res, 'Error al actualizar transacción', err);
    }
};

export const deleteTransaction = async (req: Request, res: Response) => {
    try {
        const deleted = await TransactionService.deleteTransaction(Number(req.params.id));
        if (!deleted) return res.status(404).json({ message: 'Transacción no encontrada' });
        success(res, { message: 'Transacción eliminada' });
    } catch (err) {
        error(res, 'Error al eliminar transacción', err);
    }
};

export const getTransactionsSummary = async (req: Request, res: Response) => {
    try {
        const summary = await TransactionService.getSummary(Number(req.params.userId));
        success(res, summary);
    } catch (err) {
        error(res, 'Error al obtener resumen', err);
    }
};

export const exportTransactions = async (req: Request, res: Response) => {
    try {
        const transactions = await TransactionService.getTransactionsByUser(Number(req.params.userId));
        if (!transactions.length) return res.status(404).json({ message: 'No hay transacciones para exportar' });

        const fields = ['id', 'type', 'category', 'amount', 'date', 'description'];
        const csv = CSVUtil.generateCSV(transactions.map(t => t.toJSON()), fields);

        res.header('Content-Type', 'text/csv');
        res.attachment('transactions.csv');
        res.send(csv);
    } catch (err) {
        error(res, 'Error al exportar transacciones', err);
    }
};
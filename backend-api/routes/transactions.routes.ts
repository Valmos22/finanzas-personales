import { Router } from "express";
import {
    createTransaction,
    deleteTransaction,
    exportTransactions,
    getAllTransactions,
    getTransactionById,
    getTransactionsSummary,
    updateTransaction
} from "../controllers/transactions.controllers";
import { asyncHandler } from "../middlewares/asyncHandler";
import { verifyToken } from "../middlewares/verifyToken";

const router = Router();

router.get('/transactions', verifyToken, asyncHandler(getAllTransactions));
router.post('/transactions', verifyToken, asyncHandler(createTransaction));
router.put('/transactions/:id', verifyToken, asyncHandler(updateTransaction));
router.delete('/transactions/:id', verifyToken, asyncHandler(deleteTransaction));
router.get('/transactions/user/:userId', verifyToken, asyncHandler(getTransactionById));
router.get('/transactions/user/:userId/export', verifyToken, asyncHandler(exportTransactions));
router.get('/transactions/user/:userId/summary', verifyToken, asyncHandler(getTransactionsSummary));

export default router;



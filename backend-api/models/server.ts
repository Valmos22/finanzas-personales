import cors from 'cors';
import express, { Application } from 'express';
import multer from 'multer';
import path from 'path';
import db from '../database/connection';
import transactionsRoutes from '../routes/transactions.routes';
import usersRoutes from '../routes/users.routes';

class Server {

    private app: Application;

    private port: string;

    private apiPaths = {
        users: '/api/v1/users',
        transactions: '/api/v1/',
    }

    constructor() {
        this.app = express();
        this.port = process.env.PORT || "3000";
        this.dbConnection();
        this.middlewares();
        this.rotes();
    }

    async dbConnection() {
        try {
            await db.authenticate();
            console.log('Database connected successfully');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }

    middlewares() {
        this.app.use(cors())
        this.app.use(express.json());
        this.app.use(express.static('public'));
        this.app.use("/uploads", express.static(path.join(__dirname, "../../uploads")));

        this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            if (err instanceof multer.MulterError) {
                res.status(400).json({
                    error: err.message,
                });
            } else if (err) {
                res.status(500).json({
                    error: err.message,
                });
            } else {
                next()
            }
        })
    }

    rotes() {
        this.app.use(this.apiPaths.users, usersRoutes);
        this.app.use(this.apiPaths.transactions, transactionsRoutes);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`)
        })
    }
}

export default Server;
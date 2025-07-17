import { NextFunction, Request, Response, Router } from 'express';
import {
    createUser,
    deleteUser,
    getUserById,
    getUsers,
    loginUser,
    updateUser
} from '../controllers/users.controllers';
import { upload } from '../middlewares/multerConfig';
import { verifyToken } from '../middlewares/verifyToken';

const router = Router();

//manejo de errores global
const asyncHandler = (fn: Function)=> {
    return function(req: Request, res: Response, next: NextFunction){
        return fn(req, res, next).catch(next);
    }
}

// Definición de rutas
router.get('/', verifyToken, asyncHandler(getUsers));
router.get('/user', verifyToken, asyncHandler(getUserById));
router.post('/', upload.single('imagen'), asyncHandler(createUser));
router.put('/:id', verifyToken, upload.single('imagen'), asyncHandler(updateUser));
router.delete('/:id', verifyToken, asyncHandler(deleteUser));
router.post('/login', asyncHandler(loginUser));

export default router;
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import fs from 'fs/promises';
import jwt from 'jsonwebtoken';
import path from 'path';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { JWT_SECRET } from '../database/configJwt';
import User from '../models/users';
dotenv.config();

type UserCustom = {
  id: number;
  nombre: string;
  email: string;
  role: string;
  imagen: string | null;
};

// Configuración de AWS S3
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
});
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;


//METODOS HTTP
export const getUsers = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const offset = (Number(page) - 1) * Number(limit);

        const users = await User.findAndCountAll({
            where: {
                name: {
                    [Op.like]: `%${search}%`
                }
            },
            limit: Number(limit),
            offset: offset,
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            total: users.count,
            pages: Math.ceil(users.count / Number(limit)),
            currentPage: Number(page),
            data: users.rows
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving users', error });
    }
}

export const getUserById = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(400).json({ message: 'Unauthorized: missing user ID' });
    }


    try {
        const user = await User.findByPk(userId) as unknown as UserCustom;

        if (!user || !userId) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            id: user.id,
            nombre: user.nombre,
            email: user.email,
            role: user.role,
            imagen: user.imagen
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user', error });
    }
}

export const createUser = async (req: Request, res: Response) => {
    try {
        const { nombre, email, password } = req.body;
        let imageUrl = '';

        if (!nombre || !email || !password) {
            res.status(400).json({ message: 'Nombre, email, and password are required' });
            return;
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: 'Email already in use' });
            return;
        }

        if (!req.file) {
            return res.status(400).json({ message: 'User without image ' });
        }

        const file = req.file;
        const s3Key = `users/${uuidv4()}_${file.originalname}`;

        const uploadParams = {
            Bucket: BUCKET_NAME,
            Key: s3Key,
            Body: file.buffer,
            ContentType: file.mimetype,
        };

        await s3.send(new PutObjectCommand(uploadParams));
        imageUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

        console.log('Image uploaded to S3:', imageUrl);

        const salt = bcrypt.genSaltSync(10);
        req.body.password = bcrypt.hashSync(password, salt);
        req.body.imagen = imageUrl;

        const user = User.build(req.body);
        await user.save();

        res.status(201).json(user);
    } catch (error) {
        console.error('Error al crear usuer:', error);
        return res.status(500).json({ message: 'Error creating user', error: error });
    }
}

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const body = req.body;

    try {
        const user = await User.findByPk(id);
        const userData = user?.toJSON();

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        if (body.email) {
            const existingUser = await User.findOne({ where: { email: body.email, id: { [Op.ne]: id } } });
            if (existingUser) {
                if (req.file) {
                    await fs.unlink(path.resolve(req.file.path));
                }
                res.status(400).json({ message: 'Email already in use' });
                return;
            }

            if (req.file) {
                const newImagen = req.file.filename;

                if (userData?.imagen) {
                    const oldImagePath = path.resolve(`uploads/${userData.imagen}`);

                    try {
                        if (req.file) {
                            await fs.unlink(path.resolve(oldImagePath));
                        }
                    } catch (error) {
                        console.error('Error deleting old image:', error);
                    }
                }
                body.imagen = newImagen;
            } else {
                delete body.imagen;
            }
        }

        if (body.password) {
            const salt = bcrypt.genSaltSync(10);
            body.password = bcrypt.hashSync(body.password, salt);
        }
        await user.update(body);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
        return;
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);
        const userData = user?.toJSON();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (userData?.imagen) {
            const imagePath = path.resolve(`uploads/${userData.imagen}`);
            try {
                if (req.file) {
                    await fs.unlink(path.resolve(imagePath));
                }
            } catch (error) {
                console.error('Error deleting image:', error);
            }
        }

        await user.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
}

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        const userData = user?.toJSON();
        if (!user) {
            return res.status(404).json({ message: 'Incorrect credentials' });
        }

        console.log(password, userData.password);

        const isPasswordValid = await bcrypt.compare(password, userData.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({
            id: userData.id,
            email: userData.email,
            role: userData.role,
        }, JWT_SECRET, { expiresIn: '24h' });

        res.json(token)
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
}


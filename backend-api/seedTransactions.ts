// seedTransactions.ts
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1/transactions';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiZW1haWwiOiJodWdvdmFsZGVycmFtYTVAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzUyMjQ3OTk2LCJleHAiOjE3NTIzMzQzOTZ9.k2UW7NjxtJZs0N4m__Gi2LqXixlgnpTMLNhwj_80cn4';

const transactions = [
    { userId: 9, type: 'income', category: 'Salario', amount: 3500000, date: '2025-07-01', description: 'Sueldo julio' },
    { userId: 9, type: 'expense', category: 'Alquiler', amount: 1200000, date: '2025-07-02', description: 'Pago mensual alquiler' },
    { userId: 9, type: 'expense', category: 'Supermercado', amount: 380000, date: '2025-07-03', description: 'Compras casa' },
    { userId: 9, type: 'income', category: 'Freelance', amount: 750000, date: '2025-07-04', description: 'Proyecto freelance' },
    { userId: 9, type: 'expense', category: 'Transporte', amount: 80000, date: '2025-07-05', description: 'Gasolina' },
    { userId: 9, type: 'income', category: 'Venta', amount: 250000, date: '2025-07-06', description: 'Venta artículos usados' },
    { userId: 9, type: 'expense', category: 'Comida', amount: 120000, date: '2025-07-07', description: 'Restaurante con amigos' },
    { userId: 9, type: 'income', category: 'Reembolso', amount: 180000, date: '2025-07-08', description: 'Reembolso empresa' },
    { userId: 9, type: 'expense', category: 'Suscripciones', amount: 38000, date: '2025-07-09', description: 'Spotify y Netflix' },
    { userId: 9, type: 'income', category: 'Bonificación', amount: 600000, date: '2025-07-10', description: 'Bono desempeño' },
    { userId: 9, type: 'expense', category: 'Educación', amount: 230000, date: '2025-07-10', description: 'Curso online' },
    { userId: 9, type: 'expense', category: 'Regalos', amount: 70000, date: '2025-07-11', description: 'Regalo cumpleaños' },
    { userId: 9, type: 'income', category: 'Alquiler', amount: 1100000, date: '2025-07-12', description: 'Renta de propiedad' },
    { userId: 9, type: 'expense', category: 'Servicios', amount: 195000, date: '2025-07-13', description: 'Luz, agua e internet' },
    { userId: 9, type: 'income', category: 'Devolución', amount: 95000, date: '2025-07-13', description: 'Reintegro devolución producto' },
    { userId: 9, type: 'expense', category: 'Salud', amount: 250000, date: '2025-07-14', description: 'Medicinas' },
    { userId: 9, type: 'expense', category: 'Mascota', amount: 90000, date: '2025-07-14', description: 'Comida y veterinario' },
    { userId: 9, type: 'income', category: 'Donación', amount: 130000, date: '2025-07-15', description: 'Donación de familiar' },
    { userId: 9, type: 'expense', category: 'Ropa', amount: 160000, date: '2025-07-15', description: 'Zapatos y camiseta' },
    { userId: 9, type: 'income', category: 'Inversión', amount: 850000, date: '2025-07-16', description: 'Ganancia de inversión' }
];

const seedTransactions = async () => {
    try {
        for (const t of transactions) {
            const response = await axios.post(API_URL, t, {
                headers: {
                    Authorization: `${TOKEN}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log(`Transacción creada: ID ${response.data.id}`);
        }
    } catch (error: any) {
        console.error('Error creando transacción:', error.response?.data || error.message);
    }
}

seedTransactions();

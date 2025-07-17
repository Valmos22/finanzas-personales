import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Register from '../register/Register';
import style from './style.module.css';

const Login = () => {
    const { login } = useAuth();
    const [form, setForm] = useState({ email: 'hugovalderrama5@gmail.com', password: '1234' });

    // const { logout, isAuthenticated, user } = useAuth();
    const [isShowRegister, setIsShowRegister] = useState<boolean>(false);

    const { email, password } = form;

    const navigator = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login({ email, password });
        setForm({ email: '', password: '' });
        navigator('/dashboard');
    };

    const showRegister = () => {
        setIsShowRegister(true);
    };

    return (
        <>
            <div className={`max-w-sm mx-auto ${style.form_login}`}>
                <div className="mb-2">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                    <input
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        type="email"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Email"
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contraseña</label>
                    <input
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        type="password"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder='Contraseña'
                        required />
                </div>
                <button className="flex items-start mb-2" onClick={showRegister}>
                    <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Registrarse</label>
                </button>
                <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 p-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={handleSubmit}
                >
                    Iniciar Sesion
                </button>
            </div>
            <Register isShowRegister={isShowRegister} setIsShowRegister={setIsShowRegister} />
        </>
    )
}

export default Login
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ServiceUser } from '../../services/Users';
import type { RegisterType } from '../../utils/RegisterTypes';
import styles from './style.module.css';

const Register = ({ isShowRegister, setIsShowRegister }: RegisterType) => {
    const { login } = useAuth();
    const [form, setForm] = useState({
        nombre: "",
        email: "",
        password: "",
        imagen: null as File | null
    });

    const navigator = useNavigate();

    const { nombre, email, password } = form;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const { name, value } = e.target;
        if (name === 'imagen') return;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setForm((prev) => ({ ...prev, imagen: file }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = new FormData();
        data.append("nombre", form.nombre);
        data.append("email", form.email);
        data.append("password", form.password);
        if (form.imagen) {
            data.append("imagen", form.imagen);
        }
        data.append("estado", "1");
        data.append("role", "user");

        const response = await ServiceUser.createUser(data);

        if (response.status === 201) {
            const data = await response.data;
            console.log("usuario creado:", data);

            setForm({ nombre: "", email: '', password: '', imagen: null });
            login({ email: form.email, password: form.password });
            navigator('/dashboard');
            setIsShowRegister(false);
        } else {
            const error = await response.data;
            console.error("Error en registro:", error);
        }
    };

    const handleClose = () => {
        setForm({ nombre: "", email: '', password: '', imagen: null });
        setIsShowRegister(false);
    }

    return (
        <>
            {isShowRegister && <div className={`${styles.form_register}`}>
                <form className={`max-w-md mx-auto ${styles.continer_form_register}`}>
                    <h1 className={`${styles.h1}`}>Registrate</h1>
                    <div className="relative z-0 w-full mb-5 group">
                        <input type="text" value={nombre} name="nombre" onChange={handleChange} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Nombre</label>
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <input type="email" value={email} name="email" onChange={handleChange} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email</label>
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <input type="password" value={password} name="password" onChange={handleChange} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Contraseña</label>
                    </div>
                    <div className="max-w-lg mx-auto">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Upload file</label>
                        <input name='imagen' onChange={handleFileChange} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="user_avatar_help" style={{ padding: '1rem' }} id="user_avatar" type="file" />
                    </div>
                    <br />
                    <div className={`flex justify-between items-center`}>
                        <button
                            type="button"
                            className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                            onClick={handleClose}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            onClick={handleSubmit}
                        >
                            Registrarse
                        </button>
                    </div>
                </form>
            </div>}
        </>
    )
}

export default Register
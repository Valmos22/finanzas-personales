import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;
console.log("Base URL:", baseURL);

const axiosInstance = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const authToken = localStorage.getItem("authToken");
        let token: string | undefined;
        if (authToken) {
            const tokenConfig = authToken;
            token = tokenConfig;
        }
        if (token) {
            config.headers['Authorization'] = `${token}`;
        }
        return config;
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error("Unauthorized access - redirecting to login");
            // window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
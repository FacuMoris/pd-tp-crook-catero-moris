import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [logueado, setLogueado] = useState(false);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        doRefreshToken();
    }, []);

    const doRefreshToken = async () => {

        if (localStorage.getItem('token')) {

            try {
                const request = await axios.get('http://localhost:8888/refresh-token', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (request.data.success) {
                    setLogueado(true);
                    setToken(request.data.accessToken);
                }

            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }

    const login = ({ accessToken, refreshToken }) => {
        setLogueado(true);
        setToken(accessToken);
        localStorage.setItem('token', refreshToken);
    }

    const logout = () => {
        setLogueado(false);
        setToken(null);
        localStorage.removeItem('token');
    }

    return (
        <AuthContext.Provider value={{ logueado, login, logout, token }}>
            {
                (loading)
                    ?
                    <div> Cargando ... </div>
                    :
                    children
            }
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext);
}
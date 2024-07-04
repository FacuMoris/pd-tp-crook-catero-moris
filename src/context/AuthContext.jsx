import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ( {children} ) => {
    const [logueado, setLogueado] = useState(false);

    const login = () => {
        setLogueado(true);
    }

    const logout = () => {
        setLogueado(false);
    }

    return (
        <AuthContext.Provider value={ {logueado, login, logout} }>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = ()  => {
    return useContext(AuthContext);
}
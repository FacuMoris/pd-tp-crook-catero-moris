import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [registroConfirmado, setRegistroConfirmado] = useState(false);

    const confirmarRegistro = () => {
        setRegistroConfirmado(true);
    };

    return (
        <UserContext.Provider value={{ registroConfirmado, confirmarRegistro }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser debe ser usado dentro de un UserProvider');
    }
    return context;
};

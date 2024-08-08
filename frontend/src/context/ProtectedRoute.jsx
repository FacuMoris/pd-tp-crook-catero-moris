import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";


export const ProtectedRoute = ({children}) => { 

const {logueado} = useAuth();

if(logueado){
    return children;
} else {
    return <Navigate to='/login'/>
}


};
import './style/ConfirmoRegistro.css';
import { useNavigate } from "react-router-dom";

export const ConfirmoRegistro = () => {

    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
    }
    return(
        <>
            <div className="col-6 border d-flex flex-column justify-content-center text-center align-items-center" id='reg-confirmacion'>
                <h2 className='mb-4'>¡Felicitaciones!</h2>
                <p className="f2-5 mt-5">Gracias por crear tu cuenta en Valo Conecta. Ya podés iniciar sesión y empezar a divertirte!</p>
                <p className="f2-5 mb-5">No olvides cargar todos tus datos de usuario para una mejor experiencia</p>
                
                <button type="button" onClick={handleLogin} className="btn btn-primary w-50 mt-5">Iniciar Sesión</button>
            </div>
        </>
    );
}
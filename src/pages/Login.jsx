import { BannerReyna } from "../components/BannerReyna";
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer";

export const Login = () => {

    const { login } = useAuth();

    const navigate = useNavigate();

    const handlerLogin = () => {
        login();
        navigate('/home');
    }

    return (
        <>
            <BannerReyna/>
            <h2 className="text-center mb-5 mt-5">INICIAR SESIÓN</h2>
            <form className="fs-5">
                <div className="row justify-content-center">
                    <div className="col-4">

                        <div className='mb-3'>
                            <label htmlFor='exampleInputEmail1' className='form-label'>Email </label>
                            <input type='email' className='form-control' id='exampleInputEmail1' aria-describedby='emailHelp' />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='exampleInputPassword1' className='form-label'> Contraseña</label>
                            <input type='password' className='form-control' id='exampleInputPassword1' />
                        </div>
                        <button type='button' className='btn btn-primary px-4 fs-5 mt-4' onClick={handlerLogin}>
                            Confirmar
                        </button>
                    </div>
                </div>
            </form>
            <Footer/>
        </>
    )
}

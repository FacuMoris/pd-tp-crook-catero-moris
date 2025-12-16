import { BannerReyna } from "../components/BannerReyna";
import { useAuth } from "../context/AuthContext"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Login = () => {

    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')

    const handlerLogin = async () => {

        try {
            const request = await axios.post('http://localhost:8888/login', {
                email, pass
            });
            //        console.log(request.data);

            if (request.data.success) {
                login(request.data);
                navigate('/home');
            }

        } catch (error) {
            alert('Ha surgido un error' + error.message);
        }

    }

    return (
        <>
            <BannerReyna />
            <h2 className="text-center mb-5 mt-5">INICIAR SESIÓN</h2>
            <form className="fs-5">
                <div className="row justify-content-center">
                    <div className="col-4">

                        <div className='mb-3'>
                            <label htmlFor='inputEmail' className='form-label'>Email </label>
                            <input type='email' className='form-control' id='inputEmail' value={email} onChange={(e) => setEmail(e.target.value)} aria-describedby='emailHelp' />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='inputPass' className='form-label'> Contraseña</label>
                            <input type='password' className='form-control' id='inputPass' value={pass} onChange={(e) => setPass(e.target.value)} />
                        </div>
                        <button type='button' className='btn btn-primary px-4 fs-5 mt-4' onClick={handlerLogin}>
                            Confirmar
                        </button>
                    </div>
                </div>
            </form>
        </>
    )
}

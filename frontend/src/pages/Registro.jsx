import { useState } from "react";
import { BannerReyna } from "../components/BannerReyna"
import { Footer } from "../components/Footer"
import './styles/Registro.css'
import { ConfirmoRegistro } from "../components/ConfirmoRegistro";


export const Registro = () => {


    const [registro, setRegistro] = useState(false);

    const handleRegistro = () => {
        setRegistro(true);
    };
    


    if (registro) {
        return (
            <>
                <BannerReyna />
                <div className="row justify-content-center align-items-center">
                <ConfirmoRegistro/>
                </div>
                <Footer />
            </>
        )

    } else {

        return (
            <>
                <BannerReyna />
                <h2 className="text-center mb-5 mt-5">REGISTRO</h2>
                <form className="fs-5">
                    <div className="row justify-content-center">
                        <div className="col-4">

                            <div className='mb-3'>
                                <label htmlFor='input-nombre' className='form-label'>Nombre </label>
                                <input type='text' className='form-control' id='input-nombre' aria-describedby='nombre' />
                            </div>
                            <div className='mb-3'>
                                <label htmlFor='input-pass1' className='form-label'> Contraseña</label>
                                <input type='password' className='form-control' id='input-pass1' />
                            </div>
                        </div>
                        <div className="col-4">
                            <div className='mb-3'>
                                <label htmlFor='input-apellido' className='form-label'>Apellido </label>
                                <input type='text' className='form-control' id='input-apellido' aria-describedby='email' />
                            </div>
                            <div className='mb-3'>
                                <label htmlFor='input-pass2' className='form-label'> Repita su contraseña</label>
                                <input type='password' className='form-control' id='input-pass2' />
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-4">

                            <div className='mb-3'>
                                <label htmlFor='input-rol' className='form-label'>Rol dominante </label>
                                <select className="form-select" id="input-rol">
                                    <option value="">Selecciona un rol</option>
                                    <option value="">Duelista</option>
                                    <option value="">Iniciador</option>
                                    <option value="">Controlador</option>
                                    <option value="">Centinela</option>
                                </select>
                            </div>
                            <div className='mb-3'>
                                <label htmlFor='input-rango' className='form-label'>Mayor rango obtenido </label>
                                <select className="form-select" id="input-rango">
                                    <option value="">Selecciona una rango</option>
                                    <option value="">Hierro</option>
                                    <option value="">Bronce</option>
                                    <option value="">Plata</option>
                                    <option value="">Oro</option>
                                    <option value="">Platino</option>
                                    <option value="">Diamante</option>
                                    <option value="">Ascendente</option>
                                    <option value="">Inmortal</option>
                                    <option value="">Radiante</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className='mb-3'>
                                <label htmlFor='input-agente' className='form-label'>Agente dominante </label>
                                <select className="form-select" id="input-agente">
                                    <option value="">Selecciona un agente</option>
                                    <option value="">Killjoy</option>
                                    <option value="">Reyna</option>
                                    <option value="">Omen</option>
                                    <option value="">Phoenix</option>
                                </select>
                            </div>
                            <div className='mb-3'>
                                <label htmlFor='input-division' className='form-label'>División alcanzada</label>
                                <select className="form-select" id="input-division">
                                    <option value="">Selecciona una división</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center text-center">
                        <div className="col-2 mt-4">

                            <button type='button' onClick={handleRegistro} className='btn btn-primary fs-5 w-100 mt-4'>
                                Confirmar
                            </button>
                        </div>
                    </div>
                </form>
                <Footer />
            </>
        )
    }
}
import { InvitarAmigo } from "./InvitarAmigo";
import { AmigosLista } from "./AmigosLista";
import { useState } from "react";
import { EquipoActual } from "./EquipoActual";

export const RegistroEquipo = (props) => {


    const amigos = AmigosLista.results;

    const [nombreEquipo, setNombreEquipo] = useState('');
    const [equipoConfirmado, setEquipoConfirmado] = useState(false);
    const [mostrarAmigos, setMostrarAmigos] = useState(false);
    const [amigosInvitados, setAmigosInvitados] = useState([]);

    const handleConfirmarEquipo = () => {
        if (nombreEquipo.trim() !== '') {
            setEquipoConfirmado(true);
        }
    };

    const handleBuscarClick = () => {
        if (equipoConfirmado) {
            setMostrarAmigos(true);
        }
    };

    const handleInvitarAmigo = (amigo) => {
        if (!amigosInvitados.find(a => a.id === amigo.id)) {
            setAmigosInvitados(prevAmigosInvitados => [...prevAmigosInvitados, amigo]);
        }
    };

    const handleQuitarAmigo = (amigo) => {
        setAmigosInvitados(prevAmigosInvitados => prevAmigosInvitados.filter(a => a.id !== amigo.id));
    };


    return (
        <>
            <div className="row justify-content-center text-center mt-4">
                <div className="col-6 border pt-3 pt-5 pb-5">

                    <form className="fs-5">
                        <div className="row mb-5 pb-5">
                            <div className="col-6 ps-5">
                                <h2 className="pt-5">REGISTRAR EQUIPO</h2>
                                <div className='row justify-content-center mb-3'>
                                    <label htmlFor='input-equipo' className='form-label'>NOMBRE</label>
                                    <input type='text' className='form-control w-50' id='input-equipo' aria-describedby='team-name' value={nombreEquipo} onChange={(e) => setNombreEquipo(e.target.value)} />
                                </div>
                                <button type='button' className='btn btn-primary ms-2 px-4 fs-5 mt-3' onClick={handleConfirmarEquipo} >Confirmar </button>
                            </div>
                            <div className="col-6 ps-5 align-self-center">
                                <h2 className="pt-5">Invitar amigos</h2>
                                <div className='row justify-content-center mb-3 '>
                                    <div className="col-5">
                                        <button type='button' onClick={handleBuscarClick} disabled={!equipoConfirmado} className='btn btn-primary ms-2 px-4 mt-3 fs-5'>Buscar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                {amigosInvitados.length > 0 && (
                    <div className="row mt-5">
                        <div className="col-12">
                        <EquipoActual amigosInvitados={amigosInvitados}/>
                        </div>
                    </div>
                )}
                {mostrarAmigos && (
                    <div className="row mt-5">
                        <InvitarAmigo amigos={amigos} onInvitar={handleInvitarAmigo} />
                    </div>
                )}
            </div>
        </>
    );
};
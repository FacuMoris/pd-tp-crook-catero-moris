import './style/TablaEquipos.css'
import { Card } from './Card';
import { useNavigate } from 'react-router-dom'

export const TablaEquipos = (props) => {
    
    const equipos = props.equipos;
    var hayEquipos = false;
    const navigate = useNavigate()
    

    console.log(equipos);



    return (
        <div className="row justify-content-center mx-1 px-1 pt-3">
            <table className="table table-striped text-center">
                <thead>
                    <tr>
                        <th scope="col">Equipo</th>
                        <th scope="col">Miembros</th>
                        <th scope="col">Rol faltante</th>
                        <th scope="col">Acción</th>
                    </tr>
                </thead>
                <tbody className="">
                    {equipos.map(equipo => {
                        if (equipo.busca_player) {
                            hayEquipos = true;
                            return (
                                <tr key={equipo.id} className="tr-tabla-equipos align-middle">
                                    <td>{equipo.nombre}</td>
                                    <td className="align-bottom">
                                        <div className="row text-center justify-content-center">
                                            {equipo.jugadores.map(jugador => (
                                                <div key={jugador.id} className="col-1 mini-player mx-5 px-0">
                                                    <img src='/img/logo/user.png' alt="foto-perfil" className='user-png' />
                                                    <span>{jugador.alias}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td>Duelista</td>
                                    <td>UNIRME</td>
                                </tr>
                            );
                        }
                    })
                    }

                </tbody>
            </table>
            {!hayEquipos && (
                <>
                    <div className="row text-center justify-content-center">
                      <Card titulo='No hay equipos disponibles en este momento' descripcion='Podes intentarlo más tarde o formar tu propio equipo.' col='6'
                      img='/img/logo/404.png'/>
                    </div>
                    <div className="row justify-content-center text-center">
                        <div className="col-2">

                            <button type='button' onClick={() => {navigate('/formar/equipo')}} className='btn btn-primary px-4 py-2'>Formar Equipo</button>
                        </div>
                        <div className="col-2">

                            <button type='button' onClick={() => {navigate('/home')}} className='btn btn-primary px-5 py-2'>Volver</button>
                        </div>
                    </div>
                </>
            )}
        </div>

    )


}

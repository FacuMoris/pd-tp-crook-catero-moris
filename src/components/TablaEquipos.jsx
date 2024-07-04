import './style/TablaEquipos.css'

export const TablaEquipos = (props) => {

    const equipos = props.equipos;
    const equiposBusca = equipos.filter(equipo => equipo.busca_player);

    if (equiposBusca.leght == 0) {

        
    } else {

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
                        {equiposBusca.map(equipo => (
                            <tr key={equipo.id} className="tr-tabla-equipos align-middle">
                                <td>{equipo.nombre}</td>
                                <td className="align-bottom">
                                    <div className="row text-center justify-content-center">
                                        {equipo.jugadores.map(jugador => (
                                            <div key={jugador.id} className="col-1 mini-player mx-5 px-0 ">
                                                <img src='/img/logo/user.png' alt="foto-perfil" className='user-png' />
                                                <span className=''>{jugador.alias}</span>
                                            </div>
                                        ))}
                                    </div>
                                </td>
                                <td>Duelista</td>
                                <td>UNIRME</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        )
    }

}
/* 
<h1>Equipos</h1>

))} */
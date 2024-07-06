import './style/EquipoActual.css'

export const EquipoActual = ({ amigosInvitados }) => {




    return (
        <>
            <div className="row justify-content-center text-center">
                <h2 className='mt-3 py-2'>MI EQUIPO</h2>
                    <div className="col-8 border">
                <div className="row justify-content-center">


                        {amigosInvitados.map(amigo => (
                            <div key={amigo.id} className="col-2 mt-2 mb-2 ">
                                <div><img src="/img/logo/user.png" alt="icon-user" className="minicon-user" /></div>
                                <div>{amigo.alias}</div>
                                <div>{amigo.topagente}</div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </>
    )
}
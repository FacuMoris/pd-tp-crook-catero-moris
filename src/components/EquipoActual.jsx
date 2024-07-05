import './style/EquipoActual.css'

export const EquipoActual = ({ amigosInvitados }) => {




    return (
        <>
            <div className="row justify-content-center text-center border">
                <h2 className='mt-3 border py-2'>Mi equipo</h2>
                {amigosInvitados.map(amigo => (
                    <div key={amigo.id} className="col-2 mt-2 mb-2">
                        <div><img src="/img/logo/user.png" alt="icon-user" className="minicon-user" /></div>
                        <div>{amigo.alias}</div>
                        <div>{amigo.topagente}</div>
                    </div>
                ))}
            </div>
           
        </>
    )
}
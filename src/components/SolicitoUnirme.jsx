import './style/SolicitoUnirme.css'

export const SolicitoUnirme = ({ usuario }) => {

    return (
        <>
            <div className="row justify-content-center border text-center ">
                <div className="col-7 py-5">
                    <h3>Esperando confirmación del lider</h3>
                    <p>Te avisaremos cuando seas aceptado.</p>
                <img src="/img/logo/user.png" alt="user-icon" className='user-png' />
                {usuario.alias}
                </div>

            </div>
        </>
    )

}
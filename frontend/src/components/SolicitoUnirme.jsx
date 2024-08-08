import './style/SolicitoUnirme.css'

export const SolicitoUnirme = ({ usuario }) => {

    return (
        <>
            <div className="row justify-content-center text-center ">
                <div className="col-5 py-5 border mb-5 bg-success">
                    <h3>Esperando confirmación del lider</h3>
                    <p>Te avisaremos cuando seas aceptado.</p>
                <img src="/img/logo/user.png" alt="user-icon" className='user-png' />
                {usuario.alias}
                </div>

            </div>
        </>
    )

}
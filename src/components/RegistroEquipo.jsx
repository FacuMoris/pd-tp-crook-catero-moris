export const RegistroEquipo = (props) => {

    return (
        <>
            <div className="row justify-content-center text-center mt-4">
                <div className="col-6 border pt-3">
                 
                    <form className="fs-5">
                        <div className="row justify-content-start text-start mb-5 pb-5">
                            <div className="col-6 ps-5">
                            <h2 className="text-start pt-5">Registrar equipo</h2>
                                <div className='mb-3'>
                                    <label htmlFor='input-equipo' className='form-label'>Nombre del equipo </label>
                                    <input type='text' className='form-control w-50' id='input-equipo' aria-describedby='emailHelp' />
                                </div>
                                <button type='button' className='btn btn-primary ms-2 px-4 fs-5' >Confirmar </button>
                            </div>
                            <div className="col-6">
                                <h2 className="mt-5">-Nombre del equipo</h2>
                                <h3 className="ps-3 mb-5">Nombre del equipo</h3>
                                <h2>-Lider</h2>
                                <h3 className="ps-3">Nombre del lider</h3>
                            </div>
                        </div>
                    </form>
                </div>
            <div className="row border">
                
            </div>
            </div>
        </>
    );
};
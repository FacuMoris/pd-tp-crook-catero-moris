export const InvitarAmigo = (props) => {

    const { amigos, onInvitar } = props;

    const handleInvitarClick = (amigo) => {
        onInvitar(amigo);
    };


    return (
        <>
            <div className="row justify-content-center mx-1 px-1 pt-3">
                <div className="col-8">

                    <table className="table table-striped text-center border">
                        <thead>
                            <tr>
                                <th scope="col">Amigo</th>
                                <th scope="col">Buscando jugar</th>
                                <th scope="col">Agente más usado</th>
                                <th scope="col">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {amigos.map(amigo => {
                                return (
                                    <tr key={amigo.id} className="align-middle">
                                        <td>{amigo.alias}</td>
                                        <td>{amigo.busca ? 'Si' : 'No'}</td>
                                        <td>{amigo.topagente}</td>
                                        <td><button type="button" className="btn btn-primary"  onClick={() => handleInvitarClick(amigo)}>INVITAR</button></td>
                                    </tr>
                                );
                            })}

                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );

};
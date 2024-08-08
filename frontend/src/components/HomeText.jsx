import { useNavigate } from "react-router-dom";
export const HomeText = ({ welcome }) => {

    const navigate = useNavigate();
    const handleMatch = () => {
        navigate('/busca/equipo');
    };

    return (

        <div className="row justify-content-center text-center fs-4">
            <h2 className="mt-4 pt-5 fs-2 mb-4">{welcome}</h2>
            <div className="col-8">
                <p className="mt-5"><span>Valorant Conecta</span> te permite encontrar jugadores y equipos para que no pierdas la oportunidad de jugar</p>
            </div>
            <p>Estás buscando equipo?</p>
            <div className="col-6">
                <button type='button' className="btn btn-primary px-5 py-2 fs-5 mt-5" onClick={handleMatch}>MATCH</button>
            </div>
        </div>


    )
}
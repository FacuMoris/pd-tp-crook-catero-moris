import { EquiposLista } from "../components/EquiposLista"
import { Footer } from "../components/Footer";
import { TablaEquipos } from "../components/TablaEquipos";

export const Match = () => {

    const equipos = EquiposLista.results;
    

    return (
        <>
        <h2 className="text-center pt-5 mb-5">BUSCAR EQUIPO</h2>
        <TablaEquipos equipos={equipos}/>
        <Footer/>
        </>
    );
};
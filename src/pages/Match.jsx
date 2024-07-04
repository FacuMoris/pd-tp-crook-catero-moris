import { EquiposLista } from "../components/EquiposLista"
import { TablaEquipos } from "../components/TablaEquipos";

export const Match = () => {

    const equipos = EquiposLista.results;
    

    return (
        <TablaEquipos equipos={equipos}/>
    );
};
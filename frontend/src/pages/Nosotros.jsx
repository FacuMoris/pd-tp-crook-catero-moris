import { BannerReyna } from "../components/BannerReyna";
import { Card } from "../components/Card";
import { Footer } from "../components/Footer";

export const Nosotros = () => {
    return (
        <>
            <BannerReyna />
            <h2 className="text-center pt-4 pb-3 mb-4">NOSOTROS</h2>
            <div className="row justify-content-center align-items-center text-center">
                <Card titulo='¿Quiénes somos?' descripcion='Somos estudiantes de la carrera Analista de Sistemas en la Escuela Da Vinci. Este proyecto forma parte de la cursada de Plataformas de Desarrollo, a cargo del profesor Fernando Gaitán'
                    col='6' />
                <Card titulo='Objetivo del proyecto' descripcion='Facilitarle una herramienta al usuario con la que pueda encontrar otros jugadores para formar equipos, agregar amigos, ingresar a nuevos equipos y acceder a un blog con novedades sobre el juego y la aplicación.'
                    col='6' />

            </div>
            <div className="row justify-content-center text-center mt-5 mb-3">
                <div className="col-3"><h4>Crook Juan</h4></div>
                <div className="col-3"><h4>Catero Santiago</h4></div>
                <div className="col-3"><h4>Moris Facundo</h4></div>
            </div>
        </>
    );
}
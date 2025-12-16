import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { BannerReyna } from '../components/BannerReyna';
import { Card } from '../components/Card';
import { Footer } from '../components/Footer';

export const Inicio = () => {
    const location = useLocation();
    const { bienvenida } = useParams();

    return (
        <>
            <BannerReyna />
            <h2 className="text-center pt-4">VALORANT CONECTA</h2>
            <div className="row justify-content-center text-center mt-5">


                <Card
                    col='4'
                    titulo='Conectá con jugadores'
                    descripcion='Tenés un equipo pero siempre te falta uno? Valorant Conecta te permite encontrar jugadores según su rango y sus agentes más usados.'
                    img='./img/bg/omen.png' />


                <Card
                    col='4'
                    titulo='Encontrá tu equipo'
                    descripcion='Hay muchos equipos esperándote para que seas parte, encontrá el tuyo!.'
                    img='./img/bg/jett.jpg' />


            </div>
        </>
    );
}


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
            <h1 className="text-center">Valo Conecta</h1>
            <div className="row justify-content-center text-center mt-5">


                <Card
                    col='4'
                    titulo='Conectá con jugadores'
                    descripcion='Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa tempora sint ut placeat consequuntur, delectus dignissimos saepe sunt! Recusandae accusantium temporibus ullam, cupiditate nemo eveniet.'
                    img='./img/bg/omen.png'/>
                    

                        <Card
                    col='4'
                    titulo='Encontrá tu equipo'
                    descripcion='Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa tempora sint ut placeat consequuntur, delectus dignissimos saepe sunt! Recusandae accusantium temporibus ullam, cupiditate nemo eveniet.'
                    img='./img/bg/jett.jpg'/>
                    

            </div>
            <Footer />
        </>
    );
}


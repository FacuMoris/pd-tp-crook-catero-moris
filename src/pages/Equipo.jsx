import React from 'react';
import { Footer } from '../components/Footer';
import { RegistroEquipo } from '../components/RegistroEquipo';

export const Equipo = () => {



    return (
        <>
            <div>
                <h2 className='text-center pt-5'>FORMÁ TU EQUIPO</h2>
                <RegistroEquipo/>
               
            </div>
            <Footer />
        </>
    );
};
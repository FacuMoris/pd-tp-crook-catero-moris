import React from 'react';
import { Footer } from '../components/Footer';
import { RegistroEquipo } from '../components/RegistroEquipo';

export const Equipo = () => {



    return (
        <>
            <div>
                <h1 className='text-center'>Formar equipo</h1>
                <RegistroEquipo/>

            </div>
            <Footer />
        </>
    );
};
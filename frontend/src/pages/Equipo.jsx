import React from "react";
import { RegistroEquipo } from "../components/RegistroEquipo";

export const Equipo = () => {
    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-12 col-lg-8">
                    <div className="text-center mb-4">
                        <h2 className="fw-bold">FORMÁ TU EQUIPO</h2>
                        <p className="text-muted mb-0">
                            Elegí un nombre!
                        </p>
                    </div>

                    <RegistroEquipo />
                </div>
            </div>
        </div>
    );
};

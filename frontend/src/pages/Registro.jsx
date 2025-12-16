import { useState } from "react";
import { BannerReyna } from "../components/BannerReyna";
import "./styles/Registro.css";
import axios from "axios";
import { ConfirmoRegistro } from "../components/ConfirmoRegistro";

export const Registro = () => {
    const API = "http://localhost:8888";

    const [registro, setRegistro] = useState(false);

    // mensajes
    const [errorMsg, setErrorMsg] = useState("");
    const [okMsg, setOkMsg] = useState("");
    const [cargandoRegistro, setCargandoRegistro] = useState(false);

    // form
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [email, setEmail] = useState("");
    const [telefono, setTelefono] = useState("");
    const [pass1, setPass1] = useState("");
    const [pass2, setPass2] = useState("");

    //ui

    const esEmailValido = (value) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
    };

    const handleRegistro = async () => {
        setErrorMsg("");
        setOkMsg("");

        if (!nombre || !apellido || !email || !pass1 || !pass2) {
            setErrorMsg("Completá los campos obligatorios.");
            return;
        }

        if (!esEmailValido(email)) {
            setErrorMsg("Ingresá un email válido (ej: usuario@dominio.com).");
            return;
        }

        if (pass1 !== pass2) {
            setErrorMsg("Las contraseñas no coinciden.");
            return;
        }

        try {
            setCargandoRegistro(true);

            const registerRes = await axios.post(`${API}/register`, {
                nombre,
                apellido,
                email,
                telefono,
                pass: pass1,
            });

            if (!registerRes.data?.success) {
                setErrorMsg(registerRes.data?.message ?? "No se pudo registrar el usuario");
                return;
            }

            setOkMsg("Usuario registrado correctamente.");
            setRegistro(true);
        } catch (error) {
            const msg =
                error?.response?.data?.message || error.message || "Error desconocido";
            setErrorMsg(msg);
        } finally {
            setCargandoRegistro(false);
        }
    };

    if (registro) {
        return (
            <>
                <BannerReyna />
                <div className="container py-4">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-10 col-lg-8 col-xl-6">
                            <ConfirmoRegistro />
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <BannerReyna />

            <div className="container py-4">
                <h2 className="text-center mb-4 mt-3">REGISTRO</h2>

                <div className="row justify-content-center">
                    <div className="col-12 col-md-9 col-lg-8 col-xl-7">
                        <form className="fs-5" onSubmit={(e) => e.preventDefault()}>
                            {errorMsg && (
                                <div className="alert alert-danger" role="alert">
                                    {errorMsg}
                                </div>
                            )}

                            {okMsg && (
                                <div className="alert alert-success" role="alert">
                                    {okMsg}
                                </div>
                            )}

                            <div className="row g-3">
                                <div className="col-12 col-lg-6">
                                    <div className="mb-3">
                                        <label htmlFor="input-nombre" className="form-label">
                                            Nombre
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="input-nombre"
                                            value={nombre}
                                            onChange={(e) => setNombre(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="col-12 col-lg-6">
                                    <div className="mb-3">
                                        <label htmlFor="input-apellido" className="form-label">
                                            Apellido
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="input-apellido"
                                            value={apellido}
                                            onChange={(e) => setApellido(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="col-12 col-lg-6">
                                    <div className="mb-3">
                                        <label htmlFor="input-email" className="form-label">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="input-email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="col-12 col-lg-6">
                                    <div className="mb-3">
                                        <label htmlFor="input-telefono" className="form-label">
                                            Teléfono (opcional)
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="input-telefono"
                                            value={telefono}
                                            onChange={(e) => setTelefono(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="col-12 col-lg-6">
                                    <div className="mb-3">
                                        <label htmlFor="input-pass1" className="form-label">
                                            Contraseña
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="input-pass1"
                                            value={pass1}
                                            onChange={(e) => setPass1(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="col-12 col-lg-6">
                                    <div className="mb-3">
                                        <label htmlFor="input-pass2" className="form-label">
                                            Repita su contraseña
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="input-pass2"
                                            value={pass2}
                                            onChange={(e) => setPass2(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="col-12">
                                    <button
                                        type="button"
                                        onClick={handleRegistro}
                                        className="btn btn-primary fs-5 w-100 mt-2"
                                        disabled={cargandoRegistro}
                                    >
                                        {cargandoRegistro ? "Enviando..." : "Confirmar"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

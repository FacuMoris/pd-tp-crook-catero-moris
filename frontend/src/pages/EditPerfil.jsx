import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BannerReyna } from "../components/BannerReyna";
import { useAuth } from "../context/AuthContext";

export const EditPerfil = () => {
    const API = "http://localhost:8888";
    const navigate = useNavigate();
    const { token, logout } = useAuth();

    const [cargando, setCargando] = useState(true);

    const [guardandoUsuario, setGuardandoUsuario] = useState(false);
    const [guardandoJugador, setGuardandoJugador] = useState(false);
    const [eliminando, setEliminando] = useState(false);

    const [cambioUsuario, setCambioUsuario] = useState(false);
    const [cambioJugador, setCambioJugador] = useState(false);

    const [errorUsuario, setErrorUsuario] = useState("");
    const [okUsuario, setOkUsuario] = useState("");

    const [errorJugador, setErrorJugador] = useState("");
    const [okJugador, setOkJugador] = useState("");

    const [errorEliminar, setErrorEliminar] = useState("");
    const [okEliminar, setOkEliminar] = useState("");

    const [emailOriginal, setEmailOriginal] = useState("");

    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [telefono, setTelefono] = useState("");
    const [email, setEmail] = useState("");

    const [passActual, setPassActual] = useState("");
    const [passNueva, setPassNueva] = useState("");
    const [passNueva2, setPassNueva2] = useState("");

    const [tieneJugador, setTieneJugador] = useState(false);

    const [nickname, setNickname] = useState("");
    const [idRango, setIdRango] = useState("");
    const [idRol, setIdRol] = useState("");
    const [edad, setEdad] = useState("");
    const [bio, setBio] = useState("");

    const [rangos, setRangos] = useState([]);
    const [roles, setRoles] = useState([]);

    const headersAuth = {
        headers: { Authorization: `Bearer ${token}` },
    };

    const limpiarMensajes = () => {
        setErrorUsuario("");
        setOkUsuario("");
        setErrorJugador("");
        setOkJugador("");
        setErrorEliminar("");
        setOkEliminar("");
    };

    const esEmailValido = (value) => {
        if (!value) return true;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
    };

    const cargarDatos = async () => {
        limpiarMensajes();
        setCargando(true);

        try {
            const [userRes, jugadorRes, rangosRes, rolesRes] = await Promise.all([
                axios.get(`${API}/me`, headersAuth),
                axios.get(`${API}/me/jugador`, headersAuth),
                axios.get(`${API}/rangos`, headersAuth),
                axios.get(`${API}/roles`, headersAuth),
            ]);

            const u = userRes.data?.result;

            setNombre(u?.nombre ?? "");
            setApellido(u?.apellido ?? "");
            setTelefono(u?.telefono ?? "");
            setEmail(u?.email ?? "");
            setEmailOriginal(u?.email ?? "");

            const j = jugadorRes.data?.result;
            const existe = !!j;

            setTieneJugador(existe);

            if (existe) {
                setNickname(j?.nickname ?? "");
                setIdRango(j?.id_rango ? String(j.id_rango) : "");
                setIdRol(j?.id_rol ? String(j.id_rol) : "");
                setEdad(j?.edad === null || j?.edad === undefined ? "" : String(j.edad));
                setBio(j?.bio ?? "");
            } else {
                setNickname("");
                setIdRango("");
                setIdRol("");
                setEdad("");
                setBio("");
            }

            setRangos(rangosRes.data?.results ?? []);
            setRoles(rolesRes.data?.results ?? []);

            setPassActual("");
            setPassNueva("");
            setPassNueva2("");

            setCambioUsuario(false);
            setCambioJugador(false);
        } catch (error) {
            const status = error?.response?.status;
            const msg = error?.response?.data?.message || error.message || "Error desconocido";
            setErrorUsuario(msg);

            if (status === 401) {
                logout();
                navigate("/login");
            }
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        if (!token) return;
        cargarDatos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const onNombre = (e) => {
        setNombre(e.target.value);
        setCambioUsuario(true);
    };
    const onApellido = (e) => {
        setApellido(e.target.value);
        setCambioUsuario(true);
    };
    const onTelefono = (e) => {
        setTelefono(e.target.value);
        setCambioUsuario(true);
    };
    const onEmail = (e) => {
        setEmail(e.target.value);
        setCambioUsuario(true);
    };
    const onPassActual = (e) => {
        setPassActual(e.target.value);
        setCambioUsuario(true);
    };
    const onPassNueva = (e) => {
        setPassNueva(e.target.value);
        setCambioUsuario(true);
    };
    const onPassNueva2 = (e) => {
        setPassNueva2(e.target.value);
        setCambioUsuario(true);
    };

    const onNickname = (e) => {
        setNickname(e.target.value);
        setCambioJugador(true);
    };
    const onIdRango = (e) => {
        setIdRango(e.target.value);
        setCambioJugador(true);
    };
    const onIdRol = (e) => {
        setIdRol(e.target.value);
        setCambioJugador(true);
    };
    const onEdad = (e) => {
        setEdad(e.target.value);
        setCambioJugador(true);
    };
    const onBio = (e) => {
        setBio(e.target.value);
        setCambioJugador(true);
    };

    const guardarUsuario = async () => {
        setErrorUsuario("");
        setOkUsuario("");

        if (!nombre || !apellido) {
            setErrorUsuario("Nombre y apellido son obligatorios.");
            return;
        }

        if (email && !esEmailValido(email)) {
            setErrorUsuario("Ingresá un email válido (ej: usuario@dominio.com).");
            return;
        }

        const emailTrim = String(email || "").trim();
        const cambioEmail = emailTrim !== "" && emailTrim !== (emailOriginal ?? "");
        const cambioPass = String(passNueva || "").trim() !== "" || String(passNueva2 || "").trim() !== "";

        if ((cambioEmail || cambioPass) && !String(passActual || "").trim()) {
            setErrorUsuario("Para cambiar email o contraseña, ingresá tu contraseña actual.");
            return;
        }

        if (String(passNueva || "").trim() !== "" || String(passNueva2 || "").trim() !== "") {
            if (passNueva !== passNueva2) {
                setErrorUsuario("Las contraseñas nuevas no coinciden.");
                return;
            }
            if (String(passNueva).length < 4) {
                setErrorUsuario("La contraseña nueva es muy corta (mínimo 4).");
                return;
            }
        }

        try {
            setGuardandoUsuario(true);

            const payload = {
                nombre,
                apellido,
                telefono,
                email: emailTrim,
                ...(cambioEmail || cambioPass ? { passActual } : {}),
                ...(String(passNueva || "").trim() !== "" ? { passNueva, passNueva2 } : {}),
            };

            const res = await axios.put(`${API}/me`, payload, headersAuth);

            if (!res.data?.success) {
                setErrorUsuario(res.data?.message ?? "No se pudo actualizar el usuario");
                return;
            }

            setOkUsuario(res.data?.message ?? "Usuario actualizado");
            await cargarDatos();
        } catch (error) {
            const msg = error?.response?.data?.message || error.message || "Error desconocido";
            setErrorUsuario(msg);
        } finally {
            setGuardandoUsuario(false);
        }
    };

    const guardarJugador = async () => {
        setErrorJugador("");
        setOkJugador("");

        if (!String(nickname || "").trim() || !String(idRango || "").trim() || !String(idRol || "").trim()) {
            setErrorJugador("Completá nickname, rango y rol (obligatorios).");
            return;
        }

        try {
            setGuardandoJugador(true);

            const payload = {
                nickname,
                id_rango: Number(idRango),
                id_rol: Number(idRol),
                edad: edad === "" ? null : parseInt(edad, 10),
                bio,
            };

            const res = tieneJugador
                ? await axios.put(`${API}/me/jugador`, payload, headersAuth)
                : await axios.post(`${API}/me/jugador`, payload, headersAuth);

            if (!res.data?.success) {
                setErrorJugador(res.data?.message ?? "No se pudo guardar el jugador");
                return;
            }

            setOkJugador(res.data?.message ?? "Guardado");
            await cargarDatos();
        } catch (error) {
            const msg = error?.response?.data?.message || error.message || "Error desconocido";
            setErrorJugador(msg);
        } finally {
            setGuardandoJugador(false);
        }
    };

    const eliminarUsuario = async () => {
        setErrorEliminar("");
        setOkEliminar("");

        if (!tieneJugador) return;

        const ok = window.confirm("¿Seguro que querés eliminar el usuario?");
        if (!ok) return;

        try {
            setEliminando(true);

            const res = await axios.delete(`${API}/me/jugador`, headersAuth);

            if (!res.data?.success) {
                setErrorEliminar(res.data?.message ?? "No se pudo eliminar");
                return;
            }

            setOkEliminar(res.data?.message ?? "Eliminado");
            await cargarDatos();
        } catch (error) {
            const msg = error?.response?.data?.message || error.message || "Error desconocido";
            setErrorEliminar(msg);
        } finally {
            setEliminando(false);
        }
    };

    const bloqueado = guardandoUsuario || guardandoJugador || eliminando;

    const puedeGuardarUsuario =
        cambioUsuario && !bloqueado && String(nombre || "").trim() !== "" && String(apellido || "").trim() !== "";

    const puedeGuardarJugador =
        cambioJugador &&
        !bloqueado &&
        String(nickname || "").trim() !== "" &&
        String(idRango || "").trim() !== "" &&
        String(idRol || "").trim() !== "";

    return (
        <>
            <BannerReyna />

            <div className="container py-4">
                <h2 className="text-center mb-4 mt-3">EDITAR PERFIL</h2>

                {cargando ? (
                    <div className="alert alert-info" role="alert">
                        Cargando...
                    </div>
                ) : (
                    <>
                        <div className="row g-4">
                            <div className="col-12 col-lg-6">
                                <div className="card shadow-sm h-100">
                                    <div className="card-body">
                                        <h4 className="mb-3">Datos de usuario</h4>

                                        {errorUsuario && (
                                            <div className="alert alert-danger" role="alert">
                                                {errorUsuario}
                                            </div>
                                        )}
                                        {okUsuario && (
                                            <div className="alert alert-success" role="alert">
                                                {okUsuario}
                                            </div>
                                        )}

                                        <form onSubmit={(e) => e.preventDefault()}>
                                            <div className="row g-3">
                                                <div className="col-12 col-md-6">
                                                    <label className="form-label" htmlFor="input-nombre">
                                                        Nombre
                                                    </label>
                                                    <input id="input-nombre" className="form-control" value={nombre} onChange={onNombre} />
                                                </div>

                                                <div className="col-12 col-md-6">
                                                    <label className="form-label" htmlFor="input-apellido">
                                                        Apellido
                                                    </label>
                                                    <input id="input-apellido" className="form-control" value={apellido} onChange={onApellido} />
                                                </div>

                                                <div className="col-12">
                                                    <label className="form-label" htmlFor="input-email">
                                                        Email
                                                    </label>
                                                    <input id="input-email" type="email" className="form-control" value={email} onChange={onEmail} />
                                                </div>

                                                <div className="col-12">
                                                    <label className="form-label" htmlFor="input-telefono">
                                                        Teléfono (opcional)
                                                    </label>
                                                    <input id="input-telefono" className="form-control" value={telefono} onChange={onTelefono} />
                                                </div>

                                                <div className="col-12">
                                                    <hr />
                                                </div>

                                                <div className="col-12">
                                                    <label className="form-label" htmlFor="input-pass-actual">
                                                        Contraseña actual
                                                    </label>
                                                    <input
                                                        id="input-pass-actual"
                                                        type="password"
                                                        className="form-control"
                                                        value={passActual}
                                                        onChange={onPassActual}
                                                    />
                                                </div>

                                                <div className="col-12 col-md-6">
                                                    <label className="form-label" htmlFor="input-pass-nueva">
                                                        Nueva contraseña
                                                    </label>
                                                    <input
                                                        id="input-pass-nueva"
                                                        type="password"
                                                        className="form-control"
                                                        value={passNueva}
                                                        onChange={onPassNueva}
                                                    />
                                                </div>

                                                <div className="col-12 col-md-6">
                                                    <label className="form-label" htmlFor="input-pass-nueva2">
                                                        Repetir nueva contraseña
                                                    </label>
                                                    <input
                                                        id="input-pass-nueva2"
                                                        type="password"
                                                        className="form-control"
                                                        value={passNueva2}
                                                        onChange={onPassNueva2}
                                                    />
                                                </div>

                                                <div className="col-12 d-grid">
                                                    <button type="button" className="btn btn-primary" onClick={guardarUsuario} disabled={!puedeGuardarUsuario}>
                                                        {guardandoUsuario ? "Guardando..." : "Guardar"}
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 col-lg-6">
                                <div className="card shadow-sm h-100">
                                    <div className="card-body">
                                        <h4 className="mb-3">Perfil de jugador</h4>

                                        {!tieneJugador && (
                                            <div className="alert alert-info" role="alert">
                                                No tenés perfil de jugador. Completalo y guardalo.
                                            </div>
                                        )}

                                        {errorJugador && (
                                            <div className="alert alert-danger" role="alert">
                                                {errorJugador}
                                            </div>
                                        )}
                                        {okJugador && (
                                            <div className="alert alert-success" role="alert">
                                                {okJugador}
                                            </div>
                                        )}

                                        <form onSubmit={(e) => e.preventDefault()}>
                                            <div className="row g-3">
                                                <div className="col-12">
                                                    <label className="form-label" htmlFor="input-nickname">
                                                        Nickname
                                                    </label>
                                                    <input id="input-nickname" className="form-control" value={nickname} onChange={onNickname} />
                                                </div>

                                                <div className="col-12 col-md-6">
                                                    <label className="form-label" htmlFor="select-rango">
                                                        Rango
                                                    </label>
                                                    <select id="select-rango" className="form-select" value={idRango} onChange={onIdRango}>
                                                        <option value="">Seleccioná un rango...</option>
                                                        {rangos.map((r) => (
                                                            <option key={r.id} value={String(r.id)}>
                                                                {r.nombre}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="col-12 col-md-6">
                                                    <label className="form-label" htmlFor="select-rol">
                                                        Rol
                                                    </label>
                                                    <select id="select-rol" className="form-select" value={idRol} onChange={onIdRol}>
                                                        <option value="">Seleccioná un rol...</option>
                                                        {roles.map((r) => (
                                                            <option key={r.id} value={String(r.id)}>
                                                                {r.nombre}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="col-12">
                                                    <label className="form-label" htmlFor="input-edad">
                                                        Edad (opcional)
                                                    </label>
                                                    <input id="input-edad" type="number" className="form-control" value={edad} onChange={onEdad} min="1" />
                                                </div>

                                                <div className="col-12">
                                                    <label className="form-label" htmlFor="input-bio">
                                                        Bio (opcional)
                                                    </label>
                                                    <textarea id="input-bio" className="form-control" rows={3} value={bio} onChange={onBio} />
                                                </div>

                                                <div className="col-12 d-grid">
                                                    <button type="button" className="btn btn-primary" onClick={guardarJugador} disabled={!puedeGuardarJugador}>
                                                        {guardandoJugador ? "Guardando..." : "Guardar"}
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Acciones abajo de ambos formularios */}
                        <div className="row mt-4">
                            <div className="col-12 col-lg-8 mx-auto">
                                {errorEliminar && (
                                    <div className="alert alert-danger" role="alert">
                                        {errorEliminar}
                                    </div>
                                )}
                                {okEliminar && (
                                    <div className="alert alert-success" role="alert">
                                        {okEliminar}
                                    </div>
                                )}

                                <div className="row g-2">
                                    <div className="col-12 col-md-6 d-grid">
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => navigate("/perfil")}
                                            disabled={bloqueado}
                                        >
                                            VOLVER
                                        </button>
                                    </div>

                                    <div className="col-12 col-md-6 d-grid">
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={eliminarUsuario}
                                            disabled={bloqueado || !tieneJugador}
                                        >
                                            {eliminando ? "Eliminando..." : "ELIMINAR USUARIO"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

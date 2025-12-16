import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const EquipoActual = () => {
    const API = "http://localhost:8888";
    const navigate = useNavigate();
    const { token } = useAuth();

    const [equipo, setEquipo] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    const [chatAbierto, setChatAbierto] = useState(false);
    const [mensajes, setMensajes] = useState([]);
    const [mensaje, setMensaje] = useState("");
    const [enviando, setEnviando] = useState(false);

    const headersAuth = { headers: { Authorization: `Bearer ${token}` } };

    const cargarEquipo = async () => {
        setCargando(true);
        setError("");

        try {
            const res = await axios.get(`${API}/me/equipo-actual`, headersAuth);
            const eq = res.data?.result;

            if (!eq) {
                navigate("/busca/equipo");
                return;
            }

            setEquipo(eq);
        } catch (e) {
            const msg = e?.response?.data?.message || e.message || "Error al cargar equipo actual";
            setError(msg);
        } finally {
            setCargando(false);
        }
    };

    const cargarMensajes = async () => {
        if (!equipo?.id) return;
        const res = await axios.get(`${API}/equipos/${equipo.id}/mensajes`, headersAuth);
        setMensajes(res.data?.results ?? []);
    };

    useEffect(() => {
        if (!token) return navigate("/login");
        cargarEquipo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    useEffect(() => {
        if (chatAbierto) cargarMensajes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatAbierto, equipo?.id]);

    // ✅ ACÁ está el handler salir
    const salir = async () => {
        if (!equipo?.id) return;

        const ok = window.confirm(
            "¿Seguro que querés salir del equipo?\n\nSi sos el líder, al salir se cerrará el equipo y se expulsarán todos los miembros."
        );
        if (!ok) return;

        try {
            await axios.post(`${API}/equipos/${equipo.id}/salir`, {}, headersAuth);
            navigate("/busca/equipo");
        } catch (e) {
            alert(e?.response?.data?.message || e.message || "Error al salir");
        }
    };

    const enviar = async () => {
        if (!equipo?.id) return;
        const text = String(mensaje || "").trim();
        if (!text) return;

        try {
            setEnviando(true);
            await axios.post(`${API}/equipos/${equipo.id}/mensajes`, { mensaje: text }, headersAuth);
            setMensaje("");
            await cargarMensajes();
        } catch (e) {
            alert(e?.response?.data?.message || e.message || "Error al enviar");
        } finally {
            setEnviando(false);
        }
    };

    if (cargando) {
        return (
            <div className="container py-4">
                <div className="alert alert-info">Cargando...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-4">
                <div className="alert alert-danger">{error}</div>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <h2 className="text-center mb-4">MI EQUIPO</h2>

            <div className="card shadow-sm mb-3">
                <div className="card-body">
                    <div className="d-flex justify-content-between flex-wrap gap-2">
                        <div>
                            <h4 className="mb-1">{equipo?.nombre}</h4>
                            <div className="text-muted small">
                                Líder: {equipo?.lider_nickname} · Estado: {equipo?.estado_nombre}
                            </div>
                        </div>

                        <div className="d-flex gap-2">
                            <button className="btn btn-primary" type="button" onClick={() => setChatAbierto(true)}>
                                Enviar mensaje
                            </button>
                            <button className="btn btn-danger" type="button" onClick={salir}>
                                Salir del equipo
                            </button>
                        </div>
                    </div>

                    <hr />

                    <h5>Miembros</h5>
                    {equipo?.miembros?.length ? (
                        <div className="d-flex flex-wrap gap-2">
                            {equipo.miembros.map((m) => (
                                <span key={m.id} className="badge text-bg-secondary">
                                    {m.nickname}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <div className="text-muted">Sin miembros</div>
                    )}
                </div>
            </div>

            {chatAbierto && (
                <div className="card shadow-sm">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h5 className="mb-0">Chat del equipo</h5>
                            <button className="btn btn-outline-secondary" type="button" onClick={() => setChatAbierto(false)}>
                                Cerrar chat
                            </button>
                        </div>

                        <div className="border rounded p-2 mb-3" style={{ maxHeight: 300, overflowY: "auto" }}>
                            {mensajes.length ? (
                                mensajes.map((m) => (
                                    <div key={m.id} className="mb-2">
                                        <div className="small text-muted">
                                            {m.nickname} · {String(m.fecha_creacion)}
                                        </div>
                                        <div>{m.mensaje}</div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-muted">No hay mensajes todavía.</div>
                            )}
                        </div>

                        <div className="d-flex gap-2">
                            <input
                                className="form-control"
                                value={mensaje}
                                onChange={(e) => setMensaje(e.target.value)}
                                placeholder="Escribí un mensaje..."
                            />
                            <button className="btn btn-primary" type="button" onClick={enviar} disabled={enviando}>
                                {enviando ? "Enviando..." : "Enviar"}
                            </button>
                            <button className="btn btn-outline-secondary" type="button" onClick={cargarMensajes}>
                                Refrescar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const RegistroEquipo = () => {
    const API = "http://localhost:8888";
    const navigate = useNavigate();
    const { token } = useAuth();

    const [nombreEquipo, setNombreEquipo] = useState("");
    const [guardando, setGuardando] = useState(false);

    const [error, setError] = useState("");
    const [ok, setOk] = useState("");
    const [sinJugador, setSinJugador] = useState(false);

    const headersAuth = token ? { headers: { Authorization: `Bearer ${token}` } } : null;

    const formarEquipo = async () => {
        setError("");
        setOk("");
        setSinJugador(false);

        if (!token) {
            navigate("/login");
            return;
        }

        const nombre = String(nombreEquipo || "").trim();
        if (!nombre) {
            setError("Ingresá un nombre de equipo.");
            return;
        }

        try {
            setGuardando(true);

            // ✅ mandamos solo nombre; el estado lo define el backend (siempre 1)
            const res = await axios.post(`${API}/me/equipos`, { nombre }, headersAuth);

            if (!res.data?.success) {
                setError(res.data?.message || "No se pudo crear el equipo");
                return;
            }

            setOk(res.data?.message || "Equipo creado");
            navigate("/equipo-actual");
        } catch (e) {
            const status = e?.response?.status;
            const code = e?.response?.data?.code;
            const msg = e?.response?.data?.message || e.message || "Error al crear equipo";

            if (status === 409 && (code === "NO_JUGADOR" || msg.toLowerCase().includes("perfil jugador"))) {
                setSinJugador(true);
                setError("Necesitás completar tu perfil de jugador para poder crear un equipo.");
                return;
            }

            setError(msg);
        } finally {
            setGuardando(false);
        }
    };

    return (
        <div className="card shadow-sm">
            <div className="card-body p-4">
                <h4 className="mb-3">Registrar equipo</h4>

                {error && (
                    <div className="alert alert-danger d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <span>{error}</span>

                        {sinJugador && (
                            <button
                                type="button"
                                className="btn btn-outline-dark"
                                onClick={() => navigate("/editperfil")}
                            >
                                Completar perfil
                            </button>
                        )}
                    </div>
                )}

                {ok && <div className="alert alert-success">{ok}</div>}

                <div className="mb-3">
                    <label htmlFor="input-equipo" className="form-label">
                        Nombre del equipo
                    </label>
                    <input
                        id="input-equipo"
                        type="text"
                        className="form-control"
                        value={nombreEquipo}
                        onChange={(e) => setNombreEquipo(e.target.value)}
                        disabled={guardando}
                    />
                </div>

                <div className="d-flex justify-content-end">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={formarEquipo}
                        disabled={guardando || !String(nombreEquipo).trim()}
                    >
                        {guardando ? "Creando..." : "Formar equipo"}
                    </button>
                </div>
            </div>
        </div>
    );
};

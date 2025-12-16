import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { TablaEquipos } from "../components/TablaEquipos";

export const Match = () => {
    const API = "http://localhost:8888";
    const navigate = useNavigate();
    const { token } = useAuth();

    const [equipos, setEquipos] = useState([]);
    const [equipoActualId, setEquipoActualId] = useState(null);

    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [ok, setOk] = useState("");

    const [uniendoId, setUniendoId] = useState(null);
    const [saliendoId, setSaliendoId] = useState(null);

    const headersAuth = token ? { headers: { Authorization: `Bearer ${token}` } } : null;

    const cargarEquipoActual = async () => {
        if (!token) {
            setEquipoActualId(null);
            return;
        }
        try {
            const res = await axios.get(`${API}/me/equipo-actual`, headersAuth);
            const eq = res.data?.result;
            setEquipoActualId(eq?.id ?? null);
        } catch {
            setEquipoActualId(null);
        }
    };

    const cargarEquipos = async () => {
        setCargando(true);
        setError("");
        setOk("");

        try {
            const res = await axios.get(`${API}/equipos`);
            setEquipos(res.data?.result ?? []);
        } catch (e) {
            const msg = e?.response?.data?.message || e.message || "Error al listar equipos";
            setError(msg);
            setEquipos([]);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarEquipos();
        cargarEquipoActual();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const unirse = async (id_equipo) => {
        if (!token) return navigate("/login");

        setError("");
        setOk("");

        try {
            setUniendoId(id_equipo);
            const res = await axios.post(`${API}/equipos/${id_equipo}/unirse`, {}, headersAuth);
            if (!res.data?.success) throw new Error(res.data?.message || "No se pudo unir");

            await cargarEquipos();
            await cargarEquipoActual();
            navigate("/equipo-actual");
        } catch (e) {
            const msg = e?.response?.data?.message || e.message || "Error al unirse";
            setError(msg);
        } finally {
            setUniendoId(null);
        }
    };

    const salir = async (id_equipo) => {
        if (!token) return navigate("/login");

        setError("");
        setOk("");

        try {
            setSaliendoId(id_equipo);
            const res = await axios.post(`${API}/equipos/${id_equipo}/salir`, {}, headersAuth);
            if (!res.data?.success) throw new Error(res.data?.message || "No se pudo salir");

            setOk(res.data?.message || "Saliste del equipo");
            await cargarEquipos();
            await cargarEquipoActual();
        } catch (e) {
            const msg = e?.response?.data?.message || e.message || "Error al salir";
            setError(msg);
        } finally {
            setSaliendoId(null);
        }
    };

    return (
        <div className="container py-4">
            <h2 className="text-center mb-4">BUSCAR EQUIPO</h2>

            {cargando && <div className="alert alert-info">Cargando equipos...</div>}
            {!cargando && error && <div className="alert alert-danger">{error}</div>}
            {!cargando && ok && <div className="alert alert-success">{ok}</div>}

            {!cargando && !error && (
                <TablaEquipos
                    equipos={equipos}
                    equipoActualId={equipoActualId}
                    onUnirse={unirse}
                    onSalir={salir}
                    uniendoId={uniendoId}
                    saliendoId={saliendoId}
                />
            )}
        </div>
    );
};

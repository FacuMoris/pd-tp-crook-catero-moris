import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BannerReyna } from "../components/BannerReyna";

export const Perfil = () => {
    const API = "http://localhost:8888";
    const navigate = useNavigate();

    const { token, login, logout } = useAuth();

    const [cargando, setCargando] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    const [usuario, setUsuario] = useState(null);
    const [jugador, setJugador] = useState(null);

    const refreshTokenLS = () => localStorage.getItem("token");
    const doRefresh = async () => {
        const rt = refreshTokenLS();
        if (!rt) return null;

        const r = await axios.get(`${API}/refresh-token`, {
            headers: { Authorization: `Bearer ${rt}` },
        });

        if (!r.data?.success || !r.data?.accessToken) return null;

        login({ accessToken: r.data.accessToken, refreshToken: rt });
        return r.data.accessToken;
    };

    const authGet = async (url) => {
        let access = token;
        if (!access) {
            access = await doRefresh();
            if (!access) throw new Error("Sesión expirada. Volvé a iniciar sesión.");
        }

        try {
            return await axios.get(url, { headers: { Authorization: `Bearer ${access}` } });
        } catch (err) {
            if (err?.response?.status === 401) {
                const newToken = await doRefresh();
                if (!newToken) throw err;
                return axios.get(url, { headers: { Authorization: `Bearer ${newToken}` } });
            }
            throw err;
        }
    };

    const cargarPerfil = async () => {
        setErrorMsg("");
        setCargando(true);

        try {
            const uRes = await authGet(`${API}/me`);
            if (!uRes.data?.success) throw new Error(uRes.data?.message || "No se pudo recuperar el usuario");
            setUsuario(uRes.data.result);

            const jRes = await authGet(`${API}/me/jugador`);
            setJugador(jRes.data?.success ? jRes.data.result : null);
        } catch (err) {
            const msg = err?.response?.data?.message || err.message || "Error desconocido";
            setErrorMsg(msg);

            if (err?.response?.status === 401 || msg.includes("Sesión expirada")) {
                logout();
                navigate("/login");
            }
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarPerfil();
    }, [token]);

    return (
        <>
            <BannerReyna />

            <div className="container py-4">
                <h2 className="text-center mb-4 mt-3">PERFIL</h2>

                {cargando && (
                    <div className="alert alert-info mt-4" role="alert">
                        Cargando...
                    </div>
                )}

                {!cargando && errorMsg && (
                    <div className="alert alert-danger mt-4" role="alert">
                        {errorMsg}
                    </div>
                )}

                {!cargando && !errorMsg && (
                    <div className="row justify-content-center mt-4 g-4">

                        <div className="col-12 col-md-10 col-lg-8">
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <h4 className="card-title mb-3">Datos de usuario</h4>

                                    <div className="row g-3 fs-5">
                                        <div className="col-12 col-md-6">
                                            <div className="fw-bold">Nombre</div>
                                            <div>{usuario?.nombre ?? "-"}</div>
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <div className="fw-bold">Apellido</div>
                                            <div>{usuario?.apellido ?? "-"}</div>
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <div className="fw-bold">Email</div>
                                            <div>{usuario?.email ?? "-"}</div>
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <div className="fw-bold">Teléfono</div>
                                            <div>{usuario?.telefono ?? "-"}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-md-10 col-lg-8">
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <h4 className="card-title mb-3">Perfil de jugador</h4>

                                    {!jugador ? (
                                        <div className="alert alert-warning mb-0 fs-5" role="alert">
                                            Todavía no tenés perfil de jugador.
                                        </div>
                                    ) : (
                                        <div className="row g-3 fs-5">
                                            <div className="col-12 col-md-6">
                                                <div className="fw-bold">Nickname</div>
                                                <div>{jugador?.nickname ?? "-"}</div>
                                            </div>

                                            <div className="col-12 col-md-3">
                                                <div className="fw-bold">ID Rango</div>
                                                <div>{jugador?.id_rango ?? "-"}</div>
                                            </div>

                                            <div className="col-12 col-md-3">
                                                <div className="fw-bold">ID Rol</div>
                                                <div>{jugador?.id_rol ?? "-"}</div>
                                            </div>

                                            <div className="col-12 col-md-3">
                                                <div className="fw-bold">Edad</div>
                                                <div>{jugador?.edad ?? "-"}</div>
                                            </div>

                                            <div className="col-12 col-md-9">
                                                <div className="fw-bold">Bio</div>
                                                <div>{jugador?.bio ?? "-"}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-3 d-grid">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => navigate("/editperfil")}
                                >
                                    Editar Perfil
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

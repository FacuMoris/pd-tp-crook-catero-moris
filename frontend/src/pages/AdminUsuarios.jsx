import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const AdminUsuarios = () => {
    const API = "http://localhost:8888";
    const navigate = useNavigate();
    const { token, logout, user } = useAuth();

    const headersAuth = useMemo(
        () => ({ headers: { Authorization: `Bearer ${token}` } }),
        [token]
    );

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [usuarios, setUsuarios] = useState([]);

    // Alta
    const [nuevo, setNuevo] = useState({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        pass: "",
        is_admin: 0,
    });
    const [creando, setCreando] = useState(false);

    // Edición inline
    const [editId, setEditId] = useState(null);
    const [edit, setEdit] = useState({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        is_admin: 0,
    });
    const [guardando, setGuardando] = useState(false);

    const [borrandoId, setBorrandoId] = useState(null);

    // --- helpers admin ---
    const decodeJwtPayload = (t) => {
        try {
            const payload = t.split(".")[1];
            const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
            return JSON.parse(json);
        } catch {
            return null;
        }
    };

    const isAdmin = (() => {
        // si AuthContext ya te da user
        if (user && (user.is_admin === 1 || user.is_admin === true)) return true;
        // fallback: leer token
        const p = token ? decodeJwtPayload(token) : null;
        const flag = p?.is_admin ?? p?.IS_ADMIN;
        return flag === 1 || flag === "1" || flag === true;
    })();

    const cargar = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await axios.get(`${API}/admin/usuarios`, headersAuth);
            setUsuarios(res.data?.result ?? res.data?.results ?? []);
        } catch (e) {
            const status = e?.response?.status;
            const msg = e?.response?.data?.message || e.message || "Error";

            if (status === 401) {
                logout?.();
                navigate("/login");
                return;
            }
            if (status === 403) {
                navigate("/home");
                return;
            }

            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) return navigate("/login");
        if (!isAdmin) return navigate("/home");
        cargar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const onNuevo = (k) => (e) => {
        const val = k === "is_admin" ? (e.target.checked ? 1 : 0) : e.target.value;
        setNuevo((p) => ({ ...p, [k]: val }));
    };

    const crear = async () => {
        setError("");

        if (!nuevo.nombre.trim() || !nuevo.apellido.trim() || !nuevo.email.trim() || !nuevo.pass.trim()) {
            setError("Para crear: nombre, apellido, email y contraseña son obligatorios.");
            return;
        }

        try {
            setCreando(true);
            await axios.post(`${API}/admin/usuarios`, nuevo, headersAuth);
            setNuevo({ nombre: "", apellido: "", email: "", telefono: "", pass: "", is_admin: 0 });
            await cargar();
        } catch (e) {
            setError(e?.response?.data?.message || e.message || "Error al crear usuario");
        } finally {
            setCreando(false);
        }
    };

    const empezarEditar = (u) => {
        setEditId(u.id);
        setEdit({
            nombre: u.nombre ?? "",
            apellido: u.apellido ?? "",
            email: u.email ?? "",
            telefono: u.telefono ?? "",
            is_admin: u.is_admin ? 1 : 0,
        });
    };

    const cancelarEditar = () => {
        setEditId(null);
        setEdit({ nombre: "", apellido: "", email: "", telefono: "", is_admin: 0 });
    };

    const onEdit = (k) => (e) => {
        const val = k === "is_admin" ? (e.target.checked ? 1 : 0) : e.target.value;
        setEdit((p) => ({ ...p, [k]: val }));
    };

    const guardar = async () => {
        if (!editId) return;

        setError("");
        if (!edit.nombre.trim() || !edit.apellido.trim() || !edit.email.trim()) {
            setError("Para editar: nombre, apellido y email son obligatorios.");
            return;
        }

        try {
            setGuardando(true);
            await axios.put(`${API}/admin/usuarios/${editId}`, edit, headersAuth);
            setEditId(null);
            await cargar();
        } catch (e) {
            setError(e?.response?.data?.message || e.message || "Error al actualizar usuario");
        } finally {
            setGuardando(false);
        }
    };

    const eliminar = async (id) => {
        const ok = window.confirm("¿Seguro que querés eliminar este usuario?");
        if (!ok) return;

        setError("");
        try {
            setBorrandoId(id);
            await axios.delete(`${API}/admin/usuarios/${id}`, headersAuth);
            await cargar();
        } catch (e) {
            setError(e?.response?.data?.message || e.message || "Error al eliminar usuario");
        } finally {
            setBorrandoId(null);
        }
    };

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                <h2 className="mb-0">ADMIN · Usuarios</h2>
                <button className="btn btn-outline-secondary" onClick={() => navigate("/home")}>
                    Volver
                </button>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <h5 className="mb-3">Crear usuario</h5>

                    <div className="row g-2">
                        <div className="col-12 col-md-3">
                            <input className="form-control" placeholder="Nombre" value={nuevo.nombre} onChange={onNuevo("nombre")} />
                        </div>
                        <div className="col-12 col-md-3">
                            <input className="form-control" placeholder="Apellido" value={nuevo.apellido} onChange={onNuevo("apellido")} />
                        </div>
                        <div className="col-12 col-md-3">
                            <input className="form-control" placeholder="Email" value={nuevo.email} onChange={onNuevo("email")} />
                        </div>
                        <div className="col-12 col-md-3">
                            <input className="form-control" placeholder="Teléfono" value={nuevo.telefono} onChange={onNuevo("telefono")} />
                        </div>

                        <div className="col-12 col-md-3">
                            <input className="form-control" type="password" placeholder="Contraseña" value={nuevo.pass} onChange={onNuevo("pass")} />
                        </div>

                        <div className="col-12 col-md-3 d-flex align-items-center gap-2">
                            <input id="chk-admin" type="checkbox" className="form-check-input" checked={!!nuevo.is_admin} onChange={onNuevo("is_admin")} />
                            <label htmlFor="chk-admin" className="form-check-label">
                                Es admin
                            </label>
                        </div>

                        <div className="col-12 col-md-3">
                            <button className="btn btn-primary w-100" onClick={crear} disabled={creando}>
                                {creando ? "Creando..." : "Crear"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card shadow-sm">
                <div className="card-body">
                    <h5 className="mb-3">Listado</h5>

                    {loading ? (
                        <div className="alert alert-info" role="alert">
                            Cargando...
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped align-middle">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre</th>
                                        <th>Apellido</th>
                                        <th>Email</th>
                                        <th>Teléfono</th>
                                        <th>Admin</th>
                                        <th className="text-end">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usuarios.map((u) => {
                                        const editando = editId === u.id;

                                        return (
                                            <tr key={u.id}>
                                                <td>{u.id}</td>

                                                <td>
                                                    {editando ? (
                                                        <input className="form-control" value={edit.nombre} onChange={onEdit("nombre")} />
                                                    ) : (
                                                        u.nombre
                                                    )}
                                                </td>

                                                <td>
                                                    {editando ? (
                                                        <input className="form-control" value={edit.apellido} onChange={onEdit("apellido")} />
                                                    ) : (
                                                        u.apellido
                                                    )}
                                                </td>

                                                <td>
                                                    {editando ? (
                                                        <input className="form-control" value={edit.email} onChange={onEdit("email")} />
                                                    ) : (
                                                        u.email
                                                    )}
                                                </td>

                                                <td>
                                                    {editando ? (
                                                        <input className="form-control" value={edit.telefono} onChange={onEdit("telefono")} />
                                                    ) : (
                                                        u.telefono
                                                    )}
                                                </td>

                                                <td>
                                                    {editando ? (
                                                        <input type="checkbox" checked={!!edit.is_admin} onChange={onEdit("is_admin")} />
                                                    ) : (
                                                        (u.is_admin ? "Sí" : "No")
                                                    )}
                                                </td>

                                                <td className="text-end">
                                                    {!editando ? (
                                                        <div className="d-inline-flex gap-2">
                                                            <button className="btn btn-outline-primary btn-sm" onClick={() => empezarEditar(u)}>
                                                                Editar
                                                            </button>
                                                            <button
                                                                className="btn btn-outline-danger btn-sm"
                                                                onClick={() => eliminar(u.id)}
                                                                disabled={borrandoId === u.id}
                                                            >
                                                                {borrandoId === u.id ? "Eliminando..." : "Eliminar"}
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="d-inline-flex gap-2">
                                                            <button className="btn btn-primary btn-sm" onClick={guardar} disabled={guardando}>
                                                                {guardando ? "Guardando..." : "Guardar"}
                                                            </button>
                                                            <button className="btn btn-outline-secondary btn-sm" onClick={cancelarEditar} disabled={guardando}>
                                                                Cancelar
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}

                                    {usuarios.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="text-center text-muted py-4">
                                                No hay usuarios para mostrar.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const TablaEquipos = ({ equipos = [], equipoActualId, onUnirse, onSalir, uniendoId, saliendoId }) => {
    return (
        <div className="table-responsive">
            <table className="table table-striped align-middle">
                <thead>
                    <tr>
                        <th>EQUIPO</th>
                        <th>MIEMBROS</th>
                        <th className="text-end">ACCIÓN</th>
                    </tr>
                </thead>

                <tbody>
                    {equipos.map((e) => {
                        const esMiEquipo = equipoActualId && Number(e.id) === Number(equipoActualId);

                        return (
                            <tr key={e.id}>
                                <td>
                                    <div className="fw-semibold">{e.nombre}</div>
                                    {(e.lider_nickname || e.estado_nombre) && (
                                        <div className="small text-muted">
                                            {e.lider_nickname ? <>Líder: {e.lider_nickname}</> : null}
                                            {e.lider_nickname && e.estado_nombre ? " · " : null}
                                            {e.estado_nombre ? <>Estado: {e.estado_nombre}</> : null}
                                        </div>
                                    )}
                                </td>

                                <td>
                                    {Array.isArray(e.miembros) && e.miembros.length > 0 ? (
                                        <div className="d-flex flex-wrap gap-2">
                                            {e.miembros.map((m) => (
                                                <span key={m.id} className="badge text-bg-secondary">
                                                    {m.nickname}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-muted">Sin miembros</span>
                                    )}
                                </td>

                                <td className="text-end">
                                    {esMiEquipo ? (
                                        <button
                                            className="btn btn-danger"
                                            type="button"
                                            onClick={() => onSalir?.(e.id)}
                                            disabled={saliendoId === e.id}
                                        >
                                            {saliendoId === e.id ? "Saliendo..." : "Salir"}
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-primary"
                                            type="button"
                                            onClick={() => onUnirse?.(e.id)}
                                            disabled={uniendoId === e.id}
                                        >
                                            {uniendoId === e.id ? "Uniéndote..." : "Unirme"}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

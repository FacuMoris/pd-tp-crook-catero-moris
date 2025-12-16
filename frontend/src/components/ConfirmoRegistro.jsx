import "./style/ConfirmoRegistro.css";
import { useNavigate } from "react-router-dom";

export const ConfirmoRegistro = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/login");
    };

    return (
        <div className="card shadow-sm border-0 rounded-4" id="reg-confirmacion">
            <div className="card-body p-4 p-md-5 text-center">
                <h2 className="mb-3 fw-bold">¡Felicitaciones! 🎉</h2>

                <p className="lead mb-3">
                    Gracias por crear tu cuenta en <span className="fw-semibold">Valo Conecta</span>.
                    Ya podés iniciar sesión y empezar a divertirte.
                </p>

                <p className="mb-4 text-muted">
                    No olvides cargar todos tus datos de usuario para una mejor experiencia.
                </p>

                <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                    <button
                        type="button"
                        onClick={handleLogin}
                        className="btn btn-primary btn-lg px-4"
                    >
                        Iniciar sesión
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="btn btn-outline-secondary btn-lg px-4"
                    >
                        Volver al inicio
                    </button>
                </div>
            </div>
        </div>
    );
};

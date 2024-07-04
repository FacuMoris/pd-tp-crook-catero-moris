import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './style/Menu.css';

export const Menu = () => {
    const { logueado, logout } = useAuth()

    const navigate = useNavigate()

    const handlerLogout = e => {
        e.preventDefault()
        logout()
        navigate('/')
    }

    return (
        <div className="row mb-4 mt-2" id='row-nav'>
            <nav className='navbar navbar-expand-lg bg-body-tertiary fs-6' id='nav-menu'>
                <div className='container'>
                    <a className='navbar-brand' href='#'>
                        <img src="/img/logo/app.png" alt="logo-app" id='nav-logo' />
                    </a>
                    <button
                        className='navbar-toggler'
                        type='button'
                        data-bs-toggle='collapse'
                        data-bs-target='#navbarNavDropdown'
                        aria-controls='navbarNavDropdown'
                        aria-expanded='false'
                        aria-label='Toggle navigation'
                    >
                        <span className='navbar-toggler-icon'></span>
                    </button>
                    <div className='collapse navbar-collapse justify-content-end' id='navbarNavDropdown'>
                        <ul className='navbar-nav'>
                            {logueado ? (
                                <>
                                    <li className='nav-item'>
                                        <Link className='nav-link' to='/home'>
                                            Home
                                        </Link>
                                    </li>
                                    <li className='nav-item'>
                                        <Link className='nav-link' to='/match'>
                                            Match
                                        </Link>
                                    </li>
                                    <li className='nav-item'>
                                        <Link className='nav-link' to='/equipo'>
                                            Formar equipo
                                        </Link>
                                    </li>
                                    <li className='nav-item pe-3'>
                                        <Link className='nav-link' to='/blog'>
                                            BLOG
                                        </Link>
                                    </li>
                                    <span className="fs-3">|</span>
                                    <li className='nav-item dropdown ps-3'>
                                        <a className="nav-link dropdown-togle d-flex justify-content-center" href="#" role='button' data-bs-toggle='dropdown' aria-expanded='true'>
                                            Perfil
                                        </a>
                                        <ul className="dropdown-menu w-25 mx-auto text-center">
                                            <li><Link className="dropdown-item" to='/perfil'>Ver perfil</Link>
                                            </li>
                                            <li><Link className="dropdown-item" to='/historial'>Historial</Link></li>
                                        </ul>
                                    </li>
                                    <li className="nav-item dropdown">
                                        <a className="nav-link dropdown-togle d-flex justify-content-center" href="#" role='button' data-bs-toggle='dropdown' aria-expanded='true'>
                                            Opciones
                                        </a>

                                        <ul className="dropdown-menu w-25 mx-auto text-center">
                                            <li><Link className="dropdown-item" to='/editperfil'>Editar perfil</Link>
                                            </li>
                                            <li><button type='button' className="dropdown-item" onClick={handlerLogout}>CERRAR SESIÓN</button></li>
                                        </ul>
                                    </li>

                                </>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to='/'>
                                            Inicio
                                        </Link>
                                    </li>
                                    <li className="nav-item pe-3">
                                        <Link className="nav-link" to='/nosotros'>
                                            Sobre Nosotros
                                        </Link>
                                    </li>
                                    <span className='fs-3'>|</span>
                                    <li className='nav-item ps-3'>
                                        <Link className='nav-link' to='/login'>
                                            Iniciar sesión
                                        </Link>
                                    </li>
                                    <li className='nav-item ps-3'>
                                        <Link className='nav-link' to='/registro'>
                                            Registrarse
                                        </Link>
                                    </li>
                                </>

                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}

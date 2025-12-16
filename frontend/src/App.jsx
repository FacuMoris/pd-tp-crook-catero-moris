import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

//  Paginas
import { Inicio } from './pages/Inicio'
import { Login } from './pages/Login'
import { Home } from './pages/Home'
import { Perfil } from './pages/Perfil'
import { EditPerfil } from './pages/EditPerfil'
import { Nosotros } from './pages/Nosotros'
import { Registro } from './pages/Registro'
import { Match } from './pages/Match'
import { Equipo } from './pages/Equipo'
import { Blog } from './pages/Blog'
import { Historial } from './pages/Historial'
import { EquipoActual } from "./pages/EquipoActual";
import { AdminUsuarios } from "./pages/AdminUsuarios";

// Componentes
import { Menu } from './components/Menu'
import { Footer } from './components/Footer'

// Contextos
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './context/ProtectedRoute'
import { UserProvider } from './context/UserContext'

export const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Menu />

          <main className="app-main">
            <Routes>
              <Route path='/' element={<Inicio />} />
              <Route path='/:bienvenida' element={<Inicio />} />
              <Route path='/nosotros' element={<Nosotros />} />
              <Route path='/login' element={<Login />} />
              <Route path='/registro' element={<Registro />} />

              <Route path='/home' element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path='/perfil' element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
              <Route path='/editperfil' element={<ProtectedRoute><EditPerfil /></ProtectedRoute>} />
              <Route path='/busca/equipo' element={<ProtectedRoute><Match /></ProtectedRoute>} />
              <Route path='/forma/equipo' element={<ProtectedRoute><Equipo /></ProtectedRoute>} />
              <Route path='/blog' element={<ProtectedRoute><Blog /></ProtectedRoute>} />
              <Route path='/historial' element={<ProtectedRoute><Historial /></ProtectedRoute>} />
              <Route path="/equipo-actual" element={<ProtectedRoute><EquipoActual /></ProtectedRoute>} />
              <Route path="/admin/usuarios" element={<AdminUsuarios />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

"use client"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "@/utils/AuthContext"
import Button from "@/components/atoms/Button"

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="navbar">
      <div className="container">
        <div className="flex items-center justify-between">
          <Link to="/" className="navbar-brand">
            🌍 SeismicWatch
          </Link>

          <ul className="navbar-nav">
            <li>
              <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>
                Inicio
              </Link>
            </li>

            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/map" className={`nav-link ${isActive("/map") ? "active" : ""}`}>
                    Mapa
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className={`nav-link ${isActive("/profile") ? "active" : ""}`}>
                    Perfil
                  </Link>
                </li>
                {user?.role === "admin" && (
                  <li>
                    <Link to="/admin" className={`nav-link ${isActive("/admin") ? "active" : ""}`}>
                      Admin
                    </Link>
                  </li>
                )}
                <li>
                  <span className="nav-link">Hola, {user?.first_name}</span>
                </li>
                <li>
                  <Button onClick={logout} variant="secondary">
                    Cerrar Sesión
                  </Button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className={`nav-link ${isActive("/login") ? "active" : ""}`}>
                    Iniciar Sesión
                  </Link>
                </li>
                <li>
                  <Link to="/register">
                    <Button>Registrarse</Button>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

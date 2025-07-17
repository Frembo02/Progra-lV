import { Link } from "react-router-dom"
import Card from "@/components/atoms/Card"
import LoginForm from "@/components/molecules/LoginForm"

export default function Login() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card title="Iniciar Sesión">
          <LoginForm />

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿No tienes cuenta?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

import { Link } from "react-router-dom"
import Card from "@/components/atoms/Card"
import RegisterForm from "@/components/molecules/RegisterForm"

export default function Register() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card title="Crear Cuenta">
          <RegisterForm />

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

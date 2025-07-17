"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Input from "@/components/atoms/Input"
import Button from "@/components/atoms/Button"
import { useAuth } from "@/utils/AuthContext"

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const success = await login(formData.email, formData.password)

    if (success) {
      navigate("/map")
    } else {
      setError("Credenciales inválidas")
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Correo electrónico"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <Input
        label="Contraseña"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
      />

      {error && <div className="error-message">{error}</div>}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
      </Button>
    </form>
  )
}

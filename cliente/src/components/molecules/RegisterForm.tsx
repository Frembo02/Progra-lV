"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Input from "@/components/atoms/Input"
import Button from "@/components/atoms/Button"
import { useAuth } from "@/utils/AuthContext"

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    password: "",
    confirm_password: "",
    photo: null as File | null,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.type === "file") {
      setFormData({
        ...formData,
        photo: e.target.files?.[0] || null,
      })
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = "Las contraseñas no coinciden"
    }

    if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    const success = await register(formData)

    if (success) {
      navigate("/login?message=Registro exitoso. Inicia sesión.")
    } else {
      setErrors({ general: "Error en el registro. Intenta nuevamente." })
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Nombre" name="first_name" value={formData.first_name} onChange={handleChange} required />

        <Input label="Apellidos" name="last_name" value={formData.last_name} onChange={handleChange} required />
      </div>

      <Input
        label="Correo electrónico"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <Input label="Teléfono" type="tel" name="phone" value={formData.phone} onChange={handleChange} required />

      <Input
        label="Fecha de nacimiento"
        type="date"
        name="date_of_birth"
        value={formData.date_of_birth}
        onChange={handleChange}
        required
      />

      <Input
        label="Contraseña"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        required
      />

      <Input
        label="Confirmar contraseña"
        type="password"
        name="confirm_password"
        value={formData.confirm_password}
        onChange={handleChange}
        error={errors.confirm_password}
        required
      />

      <div className="form-group">
        <label className="form-label">Fotografía</label>
        <input type="file" accept="image/*" onChange={handleChange} className="form-input" />
      </div>

      {errors.general && <div className="error-message">{errors.general}</div>}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Registrando..." : "Registrarse"}
      </Button>
    </form>
  )
}

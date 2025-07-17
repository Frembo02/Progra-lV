"use client"

import type React from "react"
import { useState } from "react"
import Card from "@/components/atoms/Card"
import Input from "@/components/atoms/Input"
import Button from "@/components/atoms/Button"
import { useAuth } from "@/utils/AuthContext"

export default function Profile() {
  const { user, updateProfile } = useAuth()
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    date_of_birth: user?.date_of_birth || "",
    current_password: "",
    new_password: "",
    confirm_password: "",
    photo: null as File | null,
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    setError("")

    // Validate passwords if changing
    if (formData.new_password) {
      if (formData.new_password !== formData.confirm_password) {
        setError("Las contraseñas no coinciden")
        setLoading(false)
        return
      }
      if (!formData.current_password) {
        setError("Debes ingresar tu contraseña actual")
        setLoading(false)
        return
      }
    }

    const updateData: any = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      date_of_birth: formData.date_of_birth,
    }

    if (formData.new_password) {
      updateData.current_password = formData.current_password
      updateData.new_password = formData.new_password
    }

    if (formData.photo) {
      updateData.photo = formData.photo
    }

    const success = await updateProfile(updateData)

    if (success) {
      setMessage("Perfil actualizado exitosamente")
      setFormData({
        ...formData,
        current_password: "",
        new_password: "",
        confirm_password: "",
      })
    } else {
      setError("Error al actualizar el perfil")
    }

    setLoading(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card title="Mi Perfil">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Nombre" name="first_name" value={formData.first_name} onChange={handleChange} required />

              <Input label="Apellidos" name="last_name" value={formData.last_name} onChange={handleChange} required />
            </div>

            <Input
              label="Fecha de nacimiento"
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
            />

            <div className="form-group">
              <label className="form-label">Nueva fotografía</label>
              <input type="file" accept="image/*" onChange={handleChange} className="form-input" />
            </div>

            <hr className="my-6" />

            <h3 className="text-lg font-semibold">Cambiar Contraseña</h3>

            <Input
              label="Contraseña actual"
              type="password"
              name="current_password"
              value={formData.current_password}
              onChange={handleChange}
            />

            <Input
              label="Nueva contraseña"
              type="password"
              name="new_password"
              value={formData.new_password}
              onChange={handleChange}
            />

            <Input
              label="Confirmar nueva contraseña"
              type="password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
            />

            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Actualizando..." : "Actualizar Perfil"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}

"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import axios from "axios"

interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  role: string
  created_at: string
}

interface News {
  id: number
  title: string
  content: string
  date_posted: string
  author_name: string
}

export default function Admin() {
  const [users, setUsers] = useState<User[]>([])
  const [news, setNews] = useState<News[]>([])
  const [activeTab, setActiveTab] = useState<"users" | "news">("users")
  const [newsForm, setNewsForm] = useState({
    title: "",
    content: "",
  })
  const [editingNews, setEditingNews] = useState<number | null>(null)

  useEffect(() => {
    fetchUsers()
    fetchNews()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`)
      setUsers(response.data)
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  const fetchNews = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/news`)
      setNews(response.data)
    } catch (error) {
      console.error("Error fetching news:", error)
    }
  }

  const deleteUser = async (userId: number) => {
    if (confirm("¿Estás seguro de eliminar este usuario?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/users/${userId}`)
        fetchUsers()
      } catch (error) {
        console.error("Error deleting user:", error)
      }
    }
  }

  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingNews) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/news/${editingNews}`, newsForm)
        setEditingNews(null)
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/news`, newsForm)
      }
      setNewsForm({ title: "", content: "" })
      fetchNews()
    } catch (error) {
      console.error("Error saving news:", error)
    }
  }

  const editNews = (article: News) => {
    setNewsForm({
      title: article.title,
      content: article.content,
    })
    setEditingNews(article.id)
  }

  const deleteNews = async (newsId: number) => {
    if (confirm("¿Estás seguro de eliminar esta noticia?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/news/${newsId}`)
        fetchNews()
      } catch (error) {
        console.error("Error deleting news:", error)
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <Button onClick={() => setActiveTab("users")} variant={activeTab === "users" ? "primary" : "secondary"}>
          Usuarios
        </Button>
        <Button onClick={() => setActiveTab("news")} variant={activeTab === "news" ? "primary" : "secondary"}>
          Noticias
        </Button>
      </div>

      {/* Users Tab */}
      {activeTab === "users" && (
        <Card title="Gestión de Usuarios">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Nombre</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Rol</th>
                  <th className="text-left p-2">Registro</th>
                  <th className="text-left p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="p-2">
                      {user.first_name} {user.last_name}
                    </td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          user.role === "admin" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="p-2">{new Date(user.created_at).toLocaleDateString()}</td>
                    <td className="p-2">
                      {user.role !== "admin" && (
                        <Button onClick={() => deleteUser(user.id)} variant="danger" className="text-xs">
                          Eliminar
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* News Tab */}
      {activeTab === "news" && (
        <div className="space-y-6">
          <Card title={editingNews ? "Editar Noticia" : "Crear Nueva Noticia"}>
            <form onSubmit={handleNewsSubmit} className="space-y-4">
              <Input
                label="Título"
                name="title"
                value={newsForm.title}
                onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                required
              />

              <div className="form-group">
                <label className="form-label">Contenido</label>
                <textarea
                  name="content"
                  value={newsForm.content}
                  onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                  required
                  rows={6}
                  className="form-input"
                />
              </div>

              <div className="flex space-x-2">
                <Button type="submit">{editingNews ? "Actualizar" : "Crear"} Noticia</Button>
                {editingNews && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setEditingNews(null)
                      setNewsForm({ title: "", content: "" })
                    }}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </Card>

          <Card title="Noticias Existentes">
            <div className="space-y-4">
              {news.map((article) => (
                <div key={article.id} className="border-b pb-4">
                  <h3 className="font-semibold text-lg">{article.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {new Date(article.date_posted).toLocaleDateString()} - {article.author_name}
                  </p>
                  <p className="text-gray-700 mb-3">{article.content.substring(0, 200)}...</p>
                  <div className="flex space-x-2">
                    <Button onClick={() => editNews(article)} variant="secondary" className="text-xs">
                      Editar
                    </Button>
                    <Button onClick={() => deleteNews(article.id)} variant="danger" className="text-xs">
                      Eliminar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

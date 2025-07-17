"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import axios from "axios"

interface News {
  id: number
  title: string
  content: string
  date_posted: string
  author_name: string
}

export default function Home() {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/news`)
      setNews(response.data.slice(0, 3)) // Solo las 3 más recientes
    } catch (error) {
      console.error("Error fetching news:", error)
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">🌍 SeismicWatch</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Sistema inteligente de monitoreo sísmico global en tiempo real. Visualiza eventos sísmicos, mantente informado
          y accede a datos históricos de terremotos alrededor del mundo.
        </p>
        <div className="space-x-4">
          <Link to="/register">
            <Button className="text-lg px-8 py-3">Comenzar Ahora</Button>
          </Link>
          <Link to="/map">
            <Button variant="secondary" className="text-lg px-8 py-3">
              Ver Mapa
            </Button>
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Card>
          <div className="text-center">
            <div className="text-4xl mb-4">🗺️</div>
            <h3 className="text-xl font-semibold mb-2">Mapa Interactivo</h3>
            <p className="text-gray-600">
              Visualiza eventos sísmicos en tiempo real con marcadores codificados por magnitud y filtros avanzados.
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Datos en Tiempo Real</h3>
            <p className="text-gray-600">
              Información actualizada cada minuto desde la API oficial del USGS (United States Geological Survey).
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-xl font-semibold mb-2">Historial Completo</h3>
            <p className="text-gray-600">
              Accede a datos históricos de terremotos con filtros por fecha, magnitud y ubicación geográfica.
            </p>
          </div>
        </Card>
      </div>

      {/* Latest News */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">Últimas Noticias</h2>

        {loading ? (
          <div className="text-center">Cargando noticias...</div>
        ) : news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {news.map((article) => (
              <Card key={article.id}>
                <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                <p className="text-gray-600 text-sm mb-3">
                  {new Date(article.date_posted).toLocaleDateString()} - {article.author_name}
                </p>
                <p className="text-gray-700">{article.content.substring(0, 150)}...</p>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600">No hay noticias disponibles en este momento.</div>
        )}
      </div>

      {/* CTA Section */}
      <div className="text-center bg-blue-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">¿Listo para comenzar?</h2>
        <p className="text-gray-600 mb-6">
          Únete a nuestra comunidad y mantente informado sobre la actividad sísmica mundial.
        </p>
        <Link to="/register">
          <Button className="text-lg px-8 py-3">Crear Cuenta Gratuita</Button>
        </Link>
      </div>
    </div>
  )
}

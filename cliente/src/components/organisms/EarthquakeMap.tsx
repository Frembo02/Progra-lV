"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import axios from "axios"

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

interface Earthquake {
  id: string
  place: string
  magnitude: number
  depth: number
  latitude: number
  longitude: number
  event_time: string
}

interface MapFilters {
  minMagnitude: number
  startDate: string
  endDate: string
}

export default function EarthquakeMap() {
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState<MapFilters>({
    minMagnitude: 4.0,
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  })

  const fetchEarthquakes = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/earthquakes/live`, {
        params: filters,
      })
      setEarthquakes(response.data)
    } catch (error) {
      console.error("Error fetching earthquakes:", error)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchEarthquakes()

    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchEarthquakes, 60000)
    return () => clearInterval(interval)
  }, [filters])

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.type === "number" ? Number.parseFloat(e.target.value) : e.target.value,
    })
  }

  const getMagnitudeColor = (magnitude: number) => {
    if (magnitude >= 7) return "#ff0000" // Red
    if (magnitude >= 6) return "#ff8c00" // Orange
    if (magnitude >= 5) return "#ffd700" // Gold
    if (magnitude >= 4) return "#9acd32" // Yellow-green
    return "#32cd32" // Green
  }

  const createCustomIcon = (magnitude: number) => {
    const color = getMagnitudeColor(magnitude)
    const size = Math.max(10, magnitude * 3)

    return L.divIcon({
      className: "custom-earthquake-marker",
      html: `<div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: ${Math.max(8, size / 3)}px;
      ">${magnitude.toFixed(1)}</div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    })
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="form-label">Magnitud mínima</label>
            <input
              type="number"
              name="minMagnitude"
              value={filters.minMagnitude}
              onChange={handleFilterChange}
              min="1"
              max="10"
              step="0.1"
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">Fecha inicio</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">Fecha fin</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="form-input"
            />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-600">{earthquakes.length} eventos encontrados</span>
          {loading && <span className="text-sm text-blue-600">Actualizando...</span>}
        </div>
      </div>

      {/* Map */}
      <div className="card">
        <div style={{ height: "600px", width: "100%" }}>
          <MapContainer center={[0, 0]} zoom={2} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {earthquakes.map((earthquake) => (
              <Marker
                key={earthquake.id}
                position={[earthquake.latitude, earthquake.longitude]}
                icon={createCustomIcon(earthquake.magnitude)}
              >
                <Popup>
                  <div className="p-2">
                    <h4 className="font-semibold text-lg">Magnitud {earthquake.magnitude}</h4>
                    <p className="text-sm text-gray-600 mb-2">{earthquake.place}</p>
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>Profundidad:</strong> {earthquake.depth} km
                      </p>
                      <p>
                        <strong>Fecha:</strong> {new Date(earthquake.event_time).toLocaleString()}
                      </p>
                      <p>
                        <strong>Coordenadas:</strong> {earthquake.latitude.toFixed(3)},{" "}
                        {earthquake.longitude.toFixed(3)}
                      </p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Legend */}
      <div className="card">
        <h4 className="font-semibold mb-2">Leyenda de Magnitudes</h4>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span>{"< 4.0"}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
            <span>4.0 - 4.9</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-600"></div>
            <span>5.0 - 5.9</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-500"></div>
            <span>6.0 - 6.9</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span>≥ 7.0</span>
          </div>
        </div>
      </div>
    </div>
  )
}

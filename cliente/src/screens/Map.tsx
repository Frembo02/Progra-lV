import EarthquakeMap from "@/components/organisms/EarthquakeMap"

export default function Map() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mapa de Eventos Sísmicos</h1>
        <p className="text-gray-600">Visualización en tiempo real de terremotos alrededor del mundo</p>
      </div>

      <EarthquakeMap />
    </div>
  )
}

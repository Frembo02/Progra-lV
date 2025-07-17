# Servidor - Sistema de Monitoreo Sísmico

Backend Flask para el sistema de monitoreo sísmico global.

## 🚀 Instalación

1. **Crear entorno virtual:**
\`\`\`bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# o
venv\Scripts\activate     # Windows
\`\`\`

2. **Instalar dependencias:**
\`\`\`bash
pip install -r requirements.txt
\`\`\`

3. **Configurar base de datos:**
   - Crear base de datos SQL Server
   - Copiar `.env.example` a `.env`
   - Configurar cadena de conexión en `.env`

4. **Ejecutar scripts SQL:**
\`\`\`bash
# Ejecutar create_tables.sql en SQL Server Management Studio
# Ejecutar seed_data.sql para datos iniciales
\`\`\`

5. **Ejecutar servidor:**
\`\`\`bash
python app/main.py
\`\`\`

## 📡 Endpoints API

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/profile` - Obtener perfil
- `PUT /api/auth/profile` - Actualizar perfil

### Usuarios (Admin)
- `GET /api/users` - Listar usuarios
- `DELETE /api/users/{id}` - Eliminar usuario

### Noticias
- `GET /api/news` - Listar noticias
- `POST /api/news` - Crear noticia (admin)
- `PUT /api/news/{id}` - Actualizar noticia (admin)
- `DELETE /api/news/{id}` - Eliminar noticia (admin)

### Terremotos
- `GET /api/earthquakes/live` - Datos en tiempo real (USGS)
- `POST /api/earthquakes/save` - Guardar terremoto
- `GET /api/earthquakes/history` - Historial de terremotos

## 🔐 Autenticación

El sistema utiliza JWT (JSON Web Tokens) para autenticación. Include el token en el header:

\`\`\`
Authorization: Bearer <token>
\`\`\`

## 🗃️ Base de Datos

- **SQL Server** con SQLAlchemy ORM
- **Tablas:** users, earthquakes, news
- **Conexión:** pyodbc driver

## 🌍 Integración USGS

Consume datos de la API oficial del USGS:
- URL: https://earthquake.usgs.gov/fdsnws/event/1/query
- Formato: GeoJSON
- Filtros: magnitud, fecha, ubicación

## 📁 Estructura

\`\`\`
servidor/
├── app/
│   ├── api/          # Endpoints REST
│   ├── core/         # Configuración y seguridad
│   ├── db/           # Conexión base de datos
│   ├── models/       # Modelos SQLAlchemy
│   ├── schemas/      # Schemas Pydantic
│   ├── utils/        # Utilidades
│   └── main.py       # Aplicación principal
├── scripts/          # Scripts SQL
├── uploads/          # Archivos subidos
└── requirements.txt

# 🌍 Sistema Inteligente de Monitoreo Sísmico Global

Sistema web full-stack para monitoreo de eventos sísmicos en tiempo real con visualización en mapa interactivo, gestión de usuarios y noticias.

## 🎯 Descripción

**SeismicWatch** es una plataforma completa que permite:
- 📊 Monitoreo sísmico global en tiempo real
- 🗺️ Visualización interactiva con mapas de Leaflet.js
- 🔐 Sistema de autenticación y gestión de usuarios
- 📰 Administración de noticias sísmicas
- 📈 Historial y análisis de datos sísmicos
- 🌐 Integración con API oficial del USGS

## ⚙️ Tecnologías

### Frontend
- **React 18** + **Vite** + **TypeScript**
- **Leaflet.js** para mapas interactivos
- **React Router 6** para navegación
- **Atomic Design Pattern** para componentes
- **Axios** para peticiones HTTP

### Backend
- **Flask** + **SQLAlchemy** + **SQL Server**
- **JWT** para autenticación segura
- **Flask-RESTX** para documentación API
- **bcrypt** para hash de contraseñas
- **Pydantic** para validación de datos

### Base de Datos
- **SQL Server** con tablas optimizadas
- **Índices** para consultas eficientes
- **Relaciones** entre usuarios, noticias y terremotos

## 🏗️ Estructura del Proyecto

\`\`\`
/
├── cliente/                    → Frontend React + Vite + TypeScript
│   ├── src/
│   │   ├── components/
│   │   │   ├── atoms/         → Botones, inputs, textos
│   │   │   ├── molecules/     → Formularios, headers, tarjetas
│   │   │   ├── organisms/     → Layouts, menús, mapas
│   │   │   └── templates/     → Estructuras de página
│   │   ├── screens/           → Home.tsx, Login.tsx, Map.tsx, etc.
│   │   ├── navigation/        → AppRouter.tsx (React Router config)
│   │   ├── utils/             → hooks, validadores, helpers
│   │   ├── assets/            → logos, imágenes, íconos
│   │   └── main.tsx
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── .env                   → VITE_API_URL=http://localhost:8000
│   └── package.json
│
└── servidor/                   → Backend Flask + SQLAlchemy + SQL Server
    ├── app/
    │   ├── main.py            → Instancia principal de Flask
    │   ├── api/
    │   │   ├── auth.py        → Registro, login, perfil
    │   │   ├── users.py       → Gestión de usuarios
    │   │   ├── news.py        → CRUD de noticias
    │   │   └── earthquakes.py → Conexión a USGS API + historial
    │   ├── core/
    │   │   ├── config.py      → Variables de entorno
    │   │   └── security.py    → JWT y bcrypt
    │   ├── db/
    │   │   └── session.py     → Conexión SQL Server con pyodbc
    │   ├── models/            → SQLAlchemy models
    │   ├── schemas/           → Pydantic schemas
    │   └── utils/             → helpers, subida de imágenes, UUIDs
    ├── scripts/
    │   ├── create_tables.sql  → Creación de tablas
    │   └── seed_data.sql      → Datos iniciales
    ├── requirements.txt
    ├── .env.example
    └── README.md
\`\`\`

## 🛠️ Requisitos Previos

### 1. **Node.js y npm**
\`\`\`bash
# Verificar instalación
node --version  # v18.0.0 o superior
npm --version   # v8.0.0 o superior

# Descargar desde: https://nodejs.org/ (versión LTS)
\`\`\`

### 2. **Python 3.8+**
\`\`\`bash
# Verificar instalación
python --version  # 3.8.0 o superior
# o
python3 --version

# Descargar desde: https://www.python.org/downloads/
\`\`\`

### 3. **SQL Server**
Opciones disponibles:
- **SQL Server Express** (gratuito) - https://www.microsoft.com/sql-server/sql-server-downloads
- **SQL Server Developer** (gratuito)
- **Azure SQL Database**
- **SQL Server en Docker**

### 4. **SQL Server Management Studio (SSMS)** (recomendado)
- Descargar: https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms

## 🚀 Instalación y Configuración

### **PASO 1: Clonar el proyecto**
\`\`\`bash
git clone <repository-url>
cd seismic-monitoring-system
\`\`\`

### **PASO 2: Configurar Backend (servidor/)**

\`\`\`bash
# Navegar a la carpeta servidor
cd servidor

# Crear entorno virtual de Python
python -m venv venv

# Activar entorno virtual
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt
\`\`\`

### **PASO 3: Configurar Base de Datos**

#### 3.1 Crear base de datos
\`\`\`sql
-- Ejecutar en SQL Server Management Studio
CREATE DATABASE SeismicMonitoring;
USE SeismicMonitoring;
\`\`\`

#### 3.2 Configurar variables de entorno
\`\`\`bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus credenciales
\`\`\`

**Ejemplo de configuración .env:**
\`\`\`env
# Base de datos
SQLALCHEMY_DATABASE_URI=mssql+pyodbc://sa:TuPassword@localhost/SeismicMonitoring?driver=ODBC+Driver+17+for+SQL+Server

# Seguridad
SECRET_KEY=tu-clave-secreta-super-segura-aqui-cambiar-en-produccion
JWT_SECRET_KEY=tu-jwt-clave-secreta-diferente-aqui

# APIs externas
USGS_API_URL=https://earthquake.usgs.gov/fdsnws/event/1/query

# Archivos
UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=16777216

# Entorno
FLASK_ENV=development
FLASK_DEBUG=True
\`\`\`

#### 3.3 Ejecutar scripts SQL
\`\`\`bash
# Opción 1: SQL Server Management Studio
# - Conectar a tu servidor SQL Server
# - Abrir y ejecutar: scripts/create_tables.sql
# - Abrir y ejecutar: scripts/seed_data.sql

# Opción 2: Línea de comandos (sqlcmd)
sqlcmd -S localhost -d SeismicMonitoring -i scripts/create_tables.sql
sqlcmd -S localhost -d SeismicMonitoring -i scripts/seed_data.sql
\`\`\`

### **PASO 4: Configurar Frontend (cliente/)**

\`\`\`bash
# Abrir nueva terminal y navegar a cliente
cd cliente

# Instalar dependencias de Node.js
npm install

# Verificar configuración (archivo .env ya incluido)
# VITE_API_URL=http://localhost:8000
# VITE_USGS_API_URL=https://earthquake.usgs.gov/fdsnws/event/1/query
\`\`\`

## ▶️ Ejecución del Sistema

### **1. Iniciar Backend (Terminal 1)**
\`\`\`bash
cd servidor

# Activar entorno virtual (si no está activo)
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate

# Ejecutar servidor Flask
python app/main.py
\`\`\`
**✅ Backend disponible en:** http://localhost:8000

### **2. Iniciar Frontend (Terminal 2)**
\`\`\`bash
cd cliente

# Ejecutar servidor de desarrollo Vite
npm run dev
\`\`\`
**✅ Frontend disponible en:** http://localhost:5173

## 🧪 Verificación del Sistema

### **1. Verificar Backend**
\`\`\`bash
# Endpoint de salud
curl http://localhost:8000/health

# Respuesta esperada:
# {"status": "healthy", "message": "Seismic Monitoring API is running"}

# Ver todos los endpoints disponibles
curl http://localhost:8000/
\`\`\`

### **2. Verificar Frontend**
- Abrir http://localhost:5173 en el navegador
- Deberías ver la página de inicio de **SeismicWatch**

### **3. Probar Funcionalidades**
1. **Registro:** Crear cuenta nueva en `/register`
2. **Login:** Iniciar sesión en `/login`
3. **Mapa:** Visualizar eventos sísmicos en `/map`
4. **Admin:** Login con credenciales de administrador

## 🔐 Credenciales de Prueba

### **Usuario Administrador**
- **Email:** `admin@seismicwatch.com`
- **Password:** `admin123`
- **Permisos:** Gestión completa de usuarios y noticias

### **Usuario Regular**
- Crear cuenta nueva desde `/register`
- O usar cualquier email válido con contraseña de 6+ caracteres

## 📡 Endpoints de la API

### **Autenticación**
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/profile` - Obtener perfil del usuario
- `PUT /api/auth/profile` - Actualizar perfil

### **Usuarios (Solo Admin)**
- `GET /api/users` - Listar todos los usuarios
- `DELETE /api/users/{id}` - Eliminar usuario visitante

### **Noticias**
- `GET /api/news` - Listar noticias (público)
- `POST /api/news` - Crear noticia (admin)
- `PUT /api/news/{id}` - Actualizar noticia (admin)
- `DELETE /api/news/{id}` - Eliminar noticia (admin)

### **Terremotos**
- `GET /api/earthquakes/live` - Datos en tiempo real desde USGS
- `POST /api/earthquakes/save` - Guardar terremoto en BD
- `GET /api/earthquakes/history` - Historial con filtros

### **Utilidades**
- `GET /health` - Estado del servidor
- `GET /` - Información de la API

## 🗃️ Esquema de Base de Datos

### **Tabla: users**
\`\`\`sql
id INT PK IDENTITY
first_name NVARCHAR(100)
last_name NVARCHAR(100)
email NVARCHAR(150) UNIQUE
phone NVARCHAR(20)
password_hash NVARCHAR(MAX)
date_of_birth DATE
photo_path NVARCHAR(255)
role NVARCHAR(50) DEFAULT 'visitor'
last_login DATETIME
created_at DATETIME DEFAULT GETDATE()
\`\`\`

### **Tabla: earthquakes**
\`\`\`sql
id INT PK IDENTITY
place NVARCHAR(255)
magnitude FLOAT
depth FLOAT
latitude FLOAT
longitude FLOAT
event_time DATETIME
source_id NVARCHAR(100) UNIQUE
created_at DATETIME DEFAULT GETDATE()
\`\`\`

### **Tabla: news**
\`\`\`sql
id INT PK IDENTITY
title NVARCHAR(255)
content TEXT
date_posted DATETIME DEFAULT GETDATE()
author_id INT FK REFERENCES users(id)
\`\`\`

## 🌐 Integración con USGS API

### **Configuración**
- **URL Base:** https://earthquake.usgs.gov/fdsnws/event/1/query
- **Formato:** GeoJSON
- **Actualización:** Cada 60 segundos en el frontend

### **Parámetros Soportados**
- `format=geojson` - Formato de respuesta
- `starttime=YYYY-MM-DD` - Fecha inicio
- `endtime=YYYY-MM-DD` - Fecha fin
- `minmagnitude=X` - Magnitud mínima
- `minlatitude/maxlatitude` - Límites geográficos
- `minlongitude/maxlongitude` - Límites geográficos

## 🧩 Scripts Disponibles

### **Frontend (cliente/)**
\`\`\`bash
npm run dev        # Servidor desarrollo (puerto 5173)
npm run build      # Build para producción
npm run preview    # Preview del build
npm run lint       # ESLint + verificación código
npm run storybook  # Documentación componentes (puerto 6006)
\`\`\`

### **Backend (servidor/)**
\`\`\`bash
python app/main.py              # Ejecutar servidor Flask
pip install nueva-libreria      # Instalar dependencia
pip freeze > requirements.txt   # Actualizar requirements
\`\`\`

## 🔧 Solución de Problemas

### **Error: No se puede conectar a SQL Server**
\`\`\`bash
# Verificar que SQL Server esté ejecutándose
# Verificar credenciales en .env
# Instalar driver ODBC:

# Windows: Descargar Microsoft ODBC Driver
# Ubuntu/Debian:
sudo apt-get install unixodbc-dev
# macOS:
brew install unixodbc
\`\`\`

### **Error: Puerto ocupado**
\`\`\`bash
# Cambiar puerto del backend en servidor/app/main.py:
app.run(host='0.0.0.0', port=8001)

# Actualizar cliente/.env:
VITE_API_URL=http://localhost:8001
\`\`\`

### **Error: CORS**
\`\`\`bash
# Verificar configuración en servidor/app/main.py:
CORS(app, origins=["http://localhost:5173"])
\`\`\`

### **Error: Módulo no encontrado**
\`\`\`bash
# Backend:
pip install -r requirements.txt

# Frontend:
npm install
\`\`\`

## 🚀 Despliegue en Producción

### **Frontend**
\`\`\`bash
cd cliente
npm run build
# Subir carpeta dist/ a servidor web (Nginx, Apache, Vercel, Netlify)
\`\`\`

### **Backend**
\`\`\`bash
cd servidor
# Configurar .env para producción
# Usar servidor WSGI como Gunicorn
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 app.main:app
\`\`\`

## 📚 Documentación Adicional

### **Arquitectura**
- **Frontend:** Atomic Design Pattern con React
- **Backend:** Arquitectura modular con Flask Blueprints
- **Base de datos:** Normalizada con índices optimizados
- **Seguridad:** JWT + bcrypt + validación de archivos

### **Funcionalidades Principales**
- ✅ Autenticación y autorización completa
- ✅ Mapa interactivo con Leaflet.js
- ✅ Filtros avanzados por magnitud, fecha, ubicación
- ✅ Actualización automática cada 60 segundos
- ✅ Panel de administración completo
- ✅ Gestión de noticias con CRUD
- ✅ Subida y gestión de imágenes de perfil
- ✅ Historial de terremotos con búsqueda
- ✅ Responsive design para móviles

## 🤝 Contribución

1. Fork del proyecto
2. Crear rama para nueva funcionalidad (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas:
- 📧 Email: soporte@seismicwatch.com
- 🐛 Issues: GitHub Issues
- 📖 Documentación: Wiki del proyecto

---

**🌍 SeismicWatch - Monitoreo Sísmico Inteligente para un Mundo Más Seguro**

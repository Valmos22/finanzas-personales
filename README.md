# 💰 Gestión de Finanzas Personales

Aplicación Full Stack para el control financiero personal. Permite a los usuarios registrar y visualizar sus ingresos y gastos mediante una interfaz intuitiva, segura y con útiles herramientas de visualización y exportación de datos.

---

## 🚀 Tecnologías utilizadas

### 🖥️ Backend
- **Node.js** con **Express**
- **Sequelize** (ORM)
- **TypeScript**
- **MySQL**
- **JWT** (Autenticación)
- **AWS S3** (Almacenamiento de imágenes)

### 🌐 Frontend
- **React.js**
- **TypeScript**
- **Context API**
- **React Hooks**
- **Axios**

---

## 🔐 Funcionalidades Backend

- CRUD de **usuarios**
- Autenticación con **JWT**
- Subida de imágenes de perfil a **AWS S3**
- CRUD de **transacciones** (ingresos y gastos)
- Generación de **reportes** por usuario
- **Exportación de datos** a formato CSV

---

## 🧭 Funcionalidades Frontend

- Registro e inicio de sesión de usuarios
- Rutas protegidas (autenticadas) y Lazy Loading
- Dashboard con:
  - Tabla de transacciones
  - Filtros por tipo, fecha y categoría
  - Creación y edición de transacciones
  - Exportación de transacciones a CSV

---

## 🗃️ Base de datos

### 🧑 Usuarios
- `id`, `nombre`, `email`, `password`, `imagen`, `estado`, `fecha_creacion`, `fecha_actualizacion`

### 💸 Transacciones
- `id`, `userId`, `type`, `category`, `amount`, `date`, `descripcion`

**Relación**: Un usuario puede tener muchas transacciones.

---

## 🔄 Flujo de uso

1. El usuario accede a la aplicación.
2. Se registra o inicia sesión (JWT).
3. Accede al dashboard.
4. Consulta y gestiona sus transacciones.
5. Filtra y exporta sus datos.

---

## 🏗️ Arquitectura

Microservicio

# Fly Away – Frontend

Frontend en React + TypeScript + Vite para la API de reserva de vuelos Fly Away (Lab Semana 14, CS2031 DBP).

## Cómo correrlo

1. Levantar el backend (en su propia carpeta, necesita JDK 26):

```bash
./mvnw spring-boot:run
```

El backend corre en `http://localhost:8080`.

2. En esta carpeta:

```bash
npm install
npm run dev
```

Abrir `http://localhost:5173`.

Usuario de prueba: `ana.garcia@utec.edu.pe` / `Password1`

## Estructura

- `src/api.ts` – instancia de Axios (token en el header + manejo de 403)
- `src/context/` – AuthContext (usuario, login, logout)
- `src/components/` – Navbar y ProtectedRoute
- `src/pages/` – Register, Login, Search (buscar + reservar), MyBookings
- `src/utils.ts` – helpers (mensajes de error, localStorage de reservas)

## Funcionalidades

- Registro con validación de campos vacíos y errores del backend
- Login con JWT en localStorage y nombre del usuario en la barra
- Búsqueda por número de vuelo, aerolínea y rango de fechas
- Reservar vuelo (solo autenticado) con ID de reserva y detalle
- Mis reservas (IDs guardados en localStorage por usuario)
- Cerrar sesión y ruta protegida

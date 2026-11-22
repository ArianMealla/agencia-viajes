#  Viajes Andinos - Agencia de turismo

Aplicación web desarrollada en Angular para gestionar reservas de paquetes turísticos.
Permite consultar paquetes, registrar reservas, revisar el historial y cancelar reservas.

## Funcionalidades

- **Paquetes**: consulta de paquetes turísticos con búsqueda por texto y filtro por categoría.
- **Reservar**: formulario con validaciones. No permite reservar más personas que los cupos disponibles.
- **Mis reservas**: historial con fecha y estado, filtrable por estado.
- **Detalle** (`/reservas/:id`): muestra los datos de la reserva y permite cancelarla.
  Al cancelar, los cupos vuelven al paquete. Una reserva cancelada no puede cancelarse otra vez.

Los datos se guardan en **IndexedDB**, por lo que se conservan al cerrar y abrir el navegador.

## Tecnologías

- Angular
- Bootstrap 5
- IndexedDB
- TypeScript

## Requisitos

- [Node.js](https://nodejs.org) (versión LTS)
- Angular CLI: `npm install -g @angular/cli`

## Instalación y ejecución

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/[TU_USUARIO]/[NOMBRE_DEL_REPO].git
   ```
2. Entrar a la carpeta del proyecto:
   ```bash
   cd agencia-viajes
   ```
3. Instalar las dependencias:
   ```bash
   npm install
   ```
4. Ejecutar la aplicación:
   ```bash
   ng serve -o
   ```
5. Abrir en el navegador: http://localhost:4200

## Estructura del proyecto

```
src/app/
├── components/paquete-card/   → Componente hijo reutilizable (tarjeta de paquete)
├── data/                      → Datos iniciales de los paquetes
├── models/                    → Interfaces Paquete y Reserva
├── pages/
│   ├── paquetes/              → Consulta principal
│   ├── nueva-reserva/         → Formulario de registro
│   ├── reservas/              → Historial
│   └── reserva-detalle/       → Detalle y cancelación
└── services/agencia.ts        → Servicio que maneja IndexedDB
```

## Autor

[Tu nombre completo] - [Materia / Universidad]
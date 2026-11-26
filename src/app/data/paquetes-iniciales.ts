import { Paquete } from '../models/models';

export const PAQUETES_INICIALES: Paquete[] = [
  { id: 1, destino: 'Salar de Uyuni', descripcion: 'Recorrido en 4x4 por el salar más grande del mundo.',
    categoria: 'Naturaleza', precio: 1450, dias: 3, fechaSalida: '2026-12-10', cuposTotales: 12, cuposDisponibles: 12,
  imagen: '/img/uyuni.jpg' },
  { id: 2, destino: 'Copacabana e Isla del Sol', descripcion: 'Lago Titicaca, ruinas incas y navegación.',
    categoria: 'Cultural', precio: 650, dias: 2, fechaSalida: '2026-12-05', cuposTotales: 15, cuposDisponibles: 15,
  imagen: '/img/copacabana.jpg' },
  { id: 3, destino: 'Rurrenabaque y Madidi', descripcion: 'Selva amazónica, pampas y vida silvestre.',
    categoria: 'Aventura', precio: 2100, dias: 4, fechaSalida: '2027-01-08', cuposTotales: 8, cuposDisponibles: 8,
  imagen: '/img/rurrenabaque.jpg' },
  { id: 4, destino: 'Cusco y Machu Picchu', descripcion: 'La ciudad inca y su santuario histórico.',
    categoria: 'Cultural', precio: 4800, dias: 5, fechaSalida: '2027-01-15', cuposTotales: 10, cuposDisponibles: 10,
  imagen: '/img/cusco.jpg' },
  { id: 5, destino: 'Río de Janeiro', descripcion: 'Playas de Copacabana, Cristo Redentor y Pan de Azúcar.',
    categoria: 'Playa', precio: 6200, dias: 6, fechaSalida: '2027-02-01', cuposTotales: 20, cuposDisponibles: 20,
  imagen: '/img/rio.jpg' },
  { id: 6, destino: 'Coroico en bicicleta', descripcion: 'Descenso por el Camino de la Muerte y yungas.',
    categoria: 'Aventura', precio: 750, dias: 2, fechaSalida: '2026-12-12', cuposTotales: 4, cuposDisponibles: 4,
  imagen: '/img/coroico.jpg' },
  { id: 7, destino: 'Arica', descripcion: 'Playas del norte chileno y sol todo el año.',
    categoria: 'Playa', precio: 1900, dias: 4, fechaSalida: '2027-01-20', cuposTotales: 16, cuposDisponibles: 16,
  imagen: '/img/arica.jpg' },
  { id: 8, destino: 'Samaipata', descripcion: 'Fuerte de Samaipata, bosques y cascadas.',
    categoria: 'Naturaleza', precio: 980, dias: 3, fechaSalida: '2026-12-18', cuposTotales: 10, cuposDisponibles: 10,
  imagen: '/img/samaipata.jpg' }
];
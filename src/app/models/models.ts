export type Categoria = 'Naturaleza' | 'Cultural' | 'Aventura' | 'Playa';
export type EstadoReserva = 'Confirmada' | 'Cancelada';

export interface Paquete {
  id: number;
  destino: string;
  descripcion: string;
  categoria: Categoria;
  precio: number;            // precio por persona en Bs.
  dias: number;
  fechaSalida: string;
  cuposTotales: number;
  cuposDisponibles: number;
}

export interface Reserva {
  id?: number;               // lo asigna IndexedDB automáticamente
  paqueteId: number;
  destino: string;
  cliente: string;
  email: string;
  personas: number;
  total: number;
  fechaRegistro: string;
  estado: EstadoReserva;
  fechaCancelacion?: string;
}
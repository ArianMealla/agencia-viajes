import { Routes } from '@angular/router';
import { Paquetes } from './pages/paquetes/paquetes';
import { NuevaReserva } from './pages/nueva-reserva/nueva-reserva';
import { Reservas } from './pages/reservas/reservas';
import { ReservaDetalle } from './pages/reserva-detalle/reserva-detalle';

export const routes: Routes = [
  { path: '', redirectTo: 'paquetes', pathMatch: 'full' },        // ruta inicial
  { path: 'paquetes', component: Paquetes, title: 'Paquetes turísticos' },
  { path: 'reservar', component: NuevaReserva, title: 'Nueva reserva' },
  { path: 'reservas', component: Reservas, title: 'Mis reservas' },
  { path: 'reservas/:id', component: ReservaDetalle, title: 'Detalle de reserva' },
  { path: '**', redirectTo: 'paquetes' }                          // cualquier ruta desconocida
];
import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { Agencia } from '../../services/agencia';
import { Paquete, Reserva } from '../../models/models';

@Component({
  selector: 'app-reserva-detalle',
  imports: [RouterLink, CurrencyPipe, DatePipe, NgClass],
  templateUrl: './reserva-detalle.html',
  styleUrl: './reserva-detalle.css'
})
export class ReservaDetalle implements OnInit {
  private agencia = inject(Agencia);
  private route = inject(ActivatedRoute);

  reserva = signal<Reserva | undefined>(undefined);
  paquete = signal<Paquete | undefined>(undefined);
  cargando = signal(true);
  procesando = signal(false);
  mensaje = signal('');
  error = signal('');

  async ngOnInit() {
    // Lee el :id de la URL, por ejemplo /reservas/5 → 5
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (Number.isInteger(id) && id > 0) {
      const reserva = await this.agencia.obtenerReserva(id);
      if (reserva) {
        this.reserva.set(reserva);
        this.paquete.set(await this.agencia.obtenerPaquete(reserva.paqueteId));
      }
    }
    this.cargando.set(false);
  }

  async cancelar() {
    const r = this.reserva();
    if (!r) return;

    if (!confirm(`¿Seguro que deseas cancelar la reserva N° ${r.id}?`)) return;

    this.procesando.set(true);
    this.error.set('');
    try {
      const actualizada = await this.agencia.cancelarReserva(r.id!);
      this.reserva.set(actualizada);
      // Volvemos a leer el paquete para mostrar los cupos recuperados
      this.paquete.set(await this.agencia.obtenerPaquete(actualizada.paqueteId));
      this.mensaje.set(
        `Reserva cancelada. Se devolvieron ${actualizada.personas} cupo(s) al paquete "${actualizada.destino}".`
      );
    } catch (e) {
      this.error.set((e as Error).message);
    } finally {
      this.procesando.set(false);
    }
  }
}
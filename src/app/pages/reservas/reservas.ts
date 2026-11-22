import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { Agencia } from '../../services/agencia';
import { Reserva } from '../../models/models';

@Component({
  selector: 'app-reservas',
  imports: [RouterLink, CurrencyPipe, DatePipe, NgClass],
  templateUrl: './reservas.html',
  styleUrl: './reservas.css'
})
export class Reservas implements OnInit {
  private agencia = inject(Agencia);
  private router = inject(Router);

  reservas = signal<Reserva[]>([]);
  cargando = signal(true);
  filtroEstado = signal('Todas');
  estados = ['Todas', 'Confirmada', 'Cancelada'];

  reservasFiltradas = computed(() => {
    const estado = this.filtroEstado();
    return estado === 'Todas'
      ? this.reservas()
      : this.reservas().filter(r => r.estado === estado);
  });

  cantidad(estado: string): number {
    return estado === 'Todas'
      ? this.reservas().length
      : this.reservas().filter(r => r.estado === estado).length;
  }

  async ngOnInit() {
    this.reservas.set(await this.agencia.obtenerReservas());
    this.cargando.set(false);
  }

  verDetalle(id: number) {
    this.router.navigate(['/reservas', id]);
  }
}
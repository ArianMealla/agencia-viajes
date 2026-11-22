import { Component, input, output } from '@angular/core';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { Paquete } from '../../models/models';

@Component({
  selector: 'app-paquete-card',
  imports: [CurrencyPipe, DatePipe, NgClass],
  templateUrl: './paquete-card.html',
  styleUrl: './paquete-card.css'
})
export class PaqueteCard {
  // ENTRADA: el padre le envía el paquete que debe mostrar
  paquete = input.required<Paquete>();

  // SALIDA: el hijo avisa al padre cuando presionan "Reservar"
  reservar = output<Paquete>();

  colores: Record<string, string> = {
    Naturaleza: 'text-bg-success',
    Cultural: 'text-bg-warning',
    Aventura: 'text-bg-danger',
    Playa: 'text-bg-info'
  };

  alPresionarReservar() {
    this.reservar.emit(this.paquete());
  }
}
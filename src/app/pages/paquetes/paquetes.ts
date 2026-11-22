import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Agencia } from '../../services/agencia';
import { Paquete } from '../../models/models';
import { PaqueteCard } from '../../components/paquete-card/paquete-card';

@Component({
  selector: 'app-paquetes',
  imports: [PaqueteCard],
  templateUrl: './paquetes.html',
  styleUrl: './paquetes.css'
})
export class Paquetes implements OnInit {
  private agencia = inject(Agencia);
  private router = inject(Router);

  paquetes = signal<Paquete[]>([]);
  busqueda = signal('');
  categoria = signal('Todas');
  categorias = ['Todas', 'Naturaleza', 'Cultural', 'Aventura', 'Playa'];

  // Se recalcula solo cuando cambia la búsqueda, la categoría o los paquetes
  paquetesFiltrados = computed(() => {
    const texto = this.busqueda().toLowerCase().trim();
    const cat = this.categoria();

    return this.paquetes().filter(p => {
      const coincideTexto =
        p.destino.toLowerCase().includes(texto) ||
        p.descripcion.toLowerCase().includes(texto);
      const coincideCategoria = cat === 'Todas' || p.categoria === cat;
      return coincideTexto && coincideCategoria;   // ambos filtros juntos
    });
  });

  async ngOnInit() {
    this.paquetes.set(await this.agencia.obtenerPaquetes());
  }

  // Se ejecuta cuando el componente hijo emite "reservar"
  irAReservar(paquete: Paquete) {
    this.router.navigate(['/reservar'], { queryParams: { paquete: paquete.id } });
  }

  limpiarFiltros() {
    this.busqueda.set('');
    this.categoria.set('Todas');
  }
}
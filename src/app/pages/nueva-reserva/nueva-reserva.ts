import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { Agencia } from '../../services/agencia';
import { Paquete } from '../../models/models';

@Component({
  selector: 'app-nueva-reserva',
  imports: [ReactiveFormsModule, RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './nueva-reserva.html',
  styleUrl: './nueva-reserva.css'
})
export class NuevaReserva implements OnInit {
  private fb = inject(FormBuilder);
  private agencia = inject(Agencia);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  paquetes = signal<Paquete[]>([]);
  error = signal('');
  guardando = signal(false);

  // Definición del formulario y sus validaciones
  formulario = this.fb.nonNullable.group({
    paqueteId: [0, [Validators.required, Validators.min(1)]],
    cliente: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    personas: [1, [Validators.required, Validators.min(1)]]
  });

  // Valores del formulario como signal, para calcular el resumen en vivo
  private valores = toSignal(this.formulario.valueChanges, {
    initialValue: this.formulario.getRawValue()
  });

  paqueteSeleccionado = computed(() =>
    this.paquetes().find(p => p.id === this.valores().paqueteId)
  );

  total = computed(() => {
    const paquete = this.paqueteSeleccionado();
    return paquete ? paquete.precio * (this.valores().personas ?? 0) : 0;
  });

  // REGLA DEL TEMA: las personas no pueden superar los cupos disponibles
  excedeCupos = computed(() => {
    const paquete = this.paqueteSeleccionado();
    return !!paquete && (this.valores().personas ?? 0) > paquete.cuposDisponibles;
  });

  async ngOnInit() {
    this.paquetes.set(await this.agencia.obtenerPaquetes());

    // Si venimos desde una tarjeta (/reservar?paquete=3), lo preseleccionamos
    const idDesdeUrl = Number(this.route.snapshot.queryParamMap.get('paquete'));
    if (idDesdeUrl) {
      this.formulario.patchValue({ paqueteId: idDesdeUrl });
    }
  }

  // Muestra el error solo si el campo es inválido y el usuario ya lo tocó
  invalido(campo: 'paqueteId' | 'cliente' | 'email' | 'personas'): boolean {
    const control = this.formulario.controls[campo];
    return control.invalid && (control.touched || control.dirty);
  }

  async guardar() {
    this.error.set('');

    // Impide guardar si hay datos inválidos
    if (this.formulario.invalid || this.excedeCupos()) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    try {
      const datos = this.formulario.getRawValue();
      const id = await this.agencia.crearReserva({
        ...datos,
        cliente: datos.cliente.trim()
      });
      this.router.navigate(['/reservas', id]);
    } catch (e) {
      this.error.set((e as Error).message);
    } finally {
      this.guardando.set(false);
    }
  }
}
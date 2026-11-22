import { Injectable } from '@angular/core';
import { Paquete, Reserva } from '../models/models';
import { PAQUETES_INICIALES } from '../data/paquetes-iniciales';

const DB_NOMBRE = 'agenciaViajesDB';
const DB_VERSION = 1;

export interface DatosReserva {
  paqueteId: number;
  cliente: string;
  email: string;
  personas: number;
}

@Injectable({ providedIn: 'root' })
export class Agencia {
  private db: Promise<IDBDatabase> = this.abrirBaseDeDatos();

  // ---------- Conexión ----------

  private abrirBaseDeDatos(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const solicitud = indexedDB.open(DB_NOMBRE, DB_VERSION);

      // Solo se ejecuta la PRIMERA vez que se crea la base de datos
      solicitud.onupgradeneeded = () => {
        const db = solicitud.result;
        const paquetes = db.createObjectStore('paquetes', { keyPath: 'id' });
        db.createObjectStore('reservas', { keyPath: 'id', autoIncrement: true });

        // Datos iniciales: se cargan una sola vez
        PAQUETES_INICIALES.forEach(p => paquetes.add(p));
      };

      solicitud.onsuccess = () => resolve(solicitud.result);
      solicitud.onerror = () => reject(solicitud.error);
    });
  }

  // Convierte una solicitud de IndexedDB en una promesa
  private esperar<T>(solicitud: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      solicitud.onsuccess = () => resolve(solicitud.result);
      solicitud.onerror = () => reject(solicitud.error);
    });
  }

  // Espera a que la transacción termine de guardarse
  private terminar(tx: IDBTransaction): Promise<void> {
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  }

  // ---------- Paquetes ----------

  async obtenerPaquetes(): Promise<Paquete[]> {
    const db = await this.db;
    return this.esperar(db.transaction('paquetes').objectStore('paquetes').getAll());
  }

  async obtenerPaquete(id: number): Promise<Paquete | undefined> {
    const db = await this.db;
    return this.esperar(db.transaction('paquetes').objectStore('paquetes').get(id));
  }

  // ---------- Reservas ----------

  async obtenerReservas(): Promise<Reserva[]> {
    const db = await this.db;
    const reservas = await this.esperar<Reserva[]>(
      db.transaction('reservas').objectStore('reservas').getAll()
    );
    return reservas.sort((a, b) => b.id! - a.id!);   // las más recientes primero
  }

  async obtenerReserva(id: number): Promise<Reserva | undefined> {
    const db = await this.db;
    return this.esperar(db.transaction('reservas').objectStore('reservas').get(id));
  }

  async crearReserva(datos: DatosReserva): Promise<number> {
    const db = await this.db;
    const tx = db.transaction(['paquetes', 'reservas'], 'readwrite');
    const almacenPaquetes = tx.objectStore('paquetes');
    const almacenReservas = tx.objectStore('reservas');

    const paquete = await this.esperar<Paquete>(almacenPaquetes.get(datos.paqueteId));
    if (!paquete) {
      throw new Error('El paquete seleccionado no existe.');
    }

    // REGLA DEL TEMA: no se puede reservar más personas que los cupos disponibles
    if (datos.personas > paquete.cuposDisponibles) {
      throw new Error(`Solo quedan ${paquete.cuposDisponibles} cupos disponibles para este paquete.`);
    }

    paquete.cuposDisponibles -= datos.personas;
    almacenPaquetes.put(paquete);

    const reserva: Reserva = {
      ...datos,
      destino: paquete.destino,
      total: paquete.precio * datos.personas,
      fechaRegistro: new Date().toISOString(),
      estado: 'Confirmada'
    };
    const id = await this.esperar(almacenReservas.add(reserva));

    await this.terminar(tx);
    return id as number;
  }

  async cancelarReserva(id: number): Promise<Reserva> {
    const db = await this.db;
    const tx = db.transaction(['paquetes', 'reservas'], 'readwrite');
    const almacenPaquetes = tx.objectStore('paquetes');
    const almacenReservas = tx.objectStore('reservas');

    const reserva = await this.esperar<Reserva>(almacenReservas.get(id));
    if (!reserva) {
      throw new Error('La reserva no existe.');
    }

    // CONTROL DE REPETICIÓN: una reserva cancelada no se puede volver a cancelar
    if (reserva.estado === 'Cancelada') {
      throw new Error('Esta reserva ya fue cancelada.');
    }

    // CONSECUENCIA: se recuperan los cupos del paquete
    const paquete = await this.esperar<Paquete>(almacenPaquetes.get(reserva.paqueteId));
    if (paquete) {
      paquete.cuposDisponibles += reserva.personas;
      almacenPaquetes.put(paquete);
    }

    reserva.estado = 'Cancelada';
    reserva.fechaCancelacion = new Date().toISOString();
    almacenReservas.put(reserva);

    await this.terminar(tx);
    return reserva;
  }
}
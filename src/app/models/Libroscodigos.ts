

import { Codigos } from './Codigos';
import { Libros } from './Libros';

export class Libroscodigos { 
    Id: number;
    CodigoId: number;
    LibroId: number;
    Uuid: string;
    Activo: string;
    CampusId: number;
    Version: number;
    PrimeraAct: string;
    HoraFecha: Date;
    Codigo: Codigos;
    Libro: Libros;

    public constructor(init?: Partial<Libroscodigos>) {
        Object.assign(this, init);
    }
}

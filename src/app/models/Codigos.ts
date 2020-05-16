

import { Libroscodigos } from './Libroscodigos';
import { Usuarioscodigos } from './Usuarioscodigos';

export class Codigos { 
    Id: number;
    Codigo: string;
    Activo: string;
    TotalLibros: number;
    CantidadRestante: number;
    CampusId: number;
    IntentoMovil: number;
    IntentoEscritorio: number;
    Libroscodigos: Libroscodigos[];
    Usuarioscodigos: Usuarioscodigos[];

    public constructor(init?: Partial<Codigos>) {
        Object.assign(this, init);
    }
}

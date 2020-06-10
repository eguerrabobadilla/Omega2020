

import { Libroscodigos } from './Libroscodigos';

export class Libros { 
    Id: number;
    Nombre: string;
    NombreArchivo: string;
    Idioma: string;
    Grados: string;
    Escolaridad: string;
    RutaThumbnails: string;
    Version: number;
    Libroscodigos: Libroscodigos[];

    public constructor(init?: Partial<Libros>) {
        Object.assign(this, init);
    }
}

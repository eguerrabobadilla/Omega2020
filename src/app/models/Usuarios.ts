

import { Comentarios } from './Comentarios';
import { Foro } from './Foro';
import { Usuarioscodigos } from './Usuarioscodigos';

export class Usuarios { 
    Id: number;
    Nombre: string;
    ApellidoPaterno: string;
    ApellidoMaterno: string;
    Usuario: string;
    Password: string;
    Comentarios: Comentarios[];
    Foro: Foro[];
    Usuarioscodigos: Usuarioscodigos[];

    public constructor(init?: Partial<Usuarios>) {
        Object.assign(this, init);
    }
}

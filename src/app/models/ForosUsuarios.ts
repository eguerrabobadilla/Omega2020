

import { Foro } from './Foro';
import { Usuarios } from './Usuarios';

export class ForosUsuarios { 
    Id: number;
    UsuarioId: number;
    ForoId: number;
    Mensaje: string;
    Fecha: Date;
    Hora: string;
    Foro: Foro;
    Usuario: Usuarios;

    public constructor(init?: Partial<ForosUsuarios>) {
        Object.assign(this, init);
    }
}

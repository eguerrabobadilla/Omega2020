

import { Foro } from './Foro';
import { Usuarios } from './Usuarios';

export class Comentariosforo { 
    Id: number;
    UsuarioId: number;
    ForoId: number;
    Mensaje: string;
    Fecha: Date;
    Hora: string;
    Foro: Foro;
    Usuario: Usuarios;

    public constructor(init?: Partial<Comentariosforo>) {
        Object.assign(this, init);
    }
}

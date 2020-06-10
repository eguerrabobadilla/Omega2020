

import { Foro } from './Foro';
import { Usuarios } from './Usuarios';

export class Comentarios { 
    id: number;
    usuarioId: number;
    foroId: number;
    mensaje: string;
    fecha: Date;
    hora: string;
    foro: Foro;
    usuario: Usuarios;

    public constructor(init?: Partial<Comentarios>) {
        Object.assign(this, init);
    }
}

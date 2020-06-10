

import { Usuarios } from './Usuarios';
import { Comentarios } from './Comentarios';

export class Foro { 
    Id: number;
    Nombre: string;
    Descrpcion: string;
    FechaPublicacion: Date;
    HoraPulicacion: string;
    UsarioId: number;
    NumRespuestas: number;
    NumVistas: number;
    FechaUltimoComentario: Date;
    HoraUltimoComentario: string;
    Usario: Usuarios;
    Comentarios: Comentarios[];

    public constructor(init?: Partial<Foro>) {
        Object.assign(this, init);
    }
}

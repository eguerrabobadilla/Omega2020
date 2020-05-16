

import { Codigos } from './Codigos';
import { Usuarios } from './Usuarios';

export class Usuarioscodigos { 
    Id: number;
    CodigoId: number;
    UsuarioId: number;
    Codigo: Codigos;
    Usuario: Usuarios;

    public constructor(init?: Partial<Usuarioscodigos>) {
        Object.assign(this, init);
    }
}

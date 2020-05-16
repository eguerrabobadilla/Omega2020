

import { Usuarioscodigos } from './Usuarioscodigos';

export class Usuarios { 
    Id: number;
    Nombre: string;
    ApellidoPaterno: string;
    ApellidoMaterno: string;
    Usuario: string;
    Password: string;
    Usuarioscodigos: Usuarioscodigos[];

    public constructor(init?: Partial<Usuarios>) {
        Object.assign(this, init);
    }
}

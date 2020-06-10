



export class Recursos { 
    Id: number;
    Titulo: string;
    Descripcion: string;
    Mes: string;
    Semana: string;
    Ano: number;
    PathRecurso: string;

    public constructor(init?: Partial<Recursos>) {
        Object.assign(this, init);
    }
}

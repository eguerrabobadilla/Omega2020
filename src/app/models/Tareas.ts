



export class Tareas { 
    Id: number;
    Titulo: string;
    Descripcion: string;
    FechaPublicacion: Date;
    HoraPublicacion: Date;
    Image: string;

    public constructor(init?: Partial<Tareas>) {
        Object.assign(this, init);
    }
}

export class Message { 
    clientuniqueid: string;
    type: string;
    message: string;
    date: Date;
    latitude: number;
    longitude: number;

    public constructor(init?: Partial<Message>) {
        Object.assign(this, init);
    }
}
export interface DuenoResponse {
    status:   string;
    code:     number;
    message:  string;
    document: Document;
}

export interface Document {
    pageno:      string;
    pagesize:    string;
    total_count: string;
    records:     Dueno[];
}

export interface Dueno {
    id:        string;
    rut:       string;
    inicial:   string;
    nombre:    string;
    direccion: string;
    email01:   string;
    email02:   null;
    fono01:    string;
    fono02:    null;
    otro:      null;
    estado:    number;
}

export interface Search {
    columnName:  string;
    columnLogic: string;
    columnValue: string;
}
export interface ComunidadResponse {
    status:   string;
    code:     number;
    message:  string;
    document: Document;
}

export interface Document {
    pageno:      string;
    pagesize:    string;
    total_count: string;
    records:     Comunidad[];
}

export interface Comunidad {
    id:        number;
    rut:       string;
    nombre:    string;
    direccion: string;
    obs?:      string;
    estado:    number;
}
 
export interface Search {
    columnName:  string;
    columnLogic: string;
    columnValue: string;
}

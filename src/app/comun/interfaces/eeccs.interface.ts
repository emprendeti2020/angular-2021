export interface EeccResponse {
    status:   string;
    code:     number;
    message:  string;
    document: Document;
}

export interface Document {
    pageno:      string;
    pagesize:    string;
    total_count: string;
    records:     Eecc[];
}

export interface Eecc {
    id:           number;
    id_comunidad: number;
    nombre:       string;
    estado:       number;
}
 
export interface Search {
    columnName:  string;
    columnLogic: string;
    columnValue: string;
}

export interface ResidenteResponse {
    status:   string;
    code:     number;
    message:  string;
    document: Document;
}

export interface Document {
    pageno:      string;
    pagesize:    string;
    total_count: string;
    records:     Residente[];
}

export interface Residente {
    id:        number;
    numdepto?: string;
    id_depto:  number;
    rut:       string;
    nombre:    string;
    tipo:      number;
    estado:    number;
}
 
export interface Search {
    columnName:  string;
    columnLogic: string;
    columnValue: string;
}

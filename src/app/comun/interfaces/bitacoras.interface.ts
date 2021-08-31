export interface BitacoraResponse {
    status:   string;
    code:     number;
    message:  string;
    document: Document;
}

export interface Document {
    pageno:      string;
    pagesize:    string;
    total_count: string;
    records:     Bitacora[];
}

export interface Bitacora {
    id:           number;
    numdepto?:     string;
    id_depto:     number;
    ingresadopor: string;
    comentario:   string;
    fecha:        Date;
    estado:       number;
}
 
export interface Search {
    columnName:  string;
    columnLogic: string;
    columnValue: string;
}

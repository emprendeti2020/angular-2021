export interface DeptoResponse {
    status:   string;
    code:     number;
    message:  string;
    document: Document;
}

export interface Document {
    pageno:      string;
    pagesize:    string;
    total_count: string;
    records:     Depto[];
}

export interface Depto {
    id:               number;
    rut?:             string;
    id_comunidad:     number;
    numdepto:         string;
    piso?:            string;
    rol?:             string;
    bodega?:          string;
    estacionamiento?: string;
    habitaciones?:    string;
    banios?:          string;
    orientacion?:     string;
    obs?:             string;
    estado:           number;
}
 
export interface Search {
    columnName:  string;
    columnLogic: string;
    columnValue: string;
}

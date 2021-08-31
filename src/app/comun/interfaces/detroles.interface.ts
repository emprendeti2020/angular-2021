export interface DetRolResponse {
    status: string;
    code: number;
    message: string;
    document: Document;
}

export interface Document {
    pageno: string;
    pagesize: string;
    total_count: string;
    records: DetRol[];
}

export interface DetRol {
    id: number;
    id_opcion: number;
    id_rol: number;
    padre: string;
    opcion: string;
    orden: number;
    url: string;
    estado: number;
}

export interface Search {
    columnName: string;
    columnLogic: string;
    columnValue: string;
}
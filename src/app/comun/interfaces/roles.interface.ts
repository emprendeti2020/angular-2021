export interface RolResponse {
    status: string;
    code: number;
    message: string;
    document: Document;
}

export interface Document {
    pageno: string;
    pagesize: string;
    total_count: string;
    records: Rol[];
}

export interface Rol {
    id: number;
    descripcion: string;
    idopciones?: string;
    estado: number;
}

export interface Search {
    columnName: string;
    columnLogic: string;
    columnValue: string;
}

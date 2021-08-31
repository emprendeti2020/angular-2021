export interface ContratoResponse {
    status: string;
    code: number;
    message: string;
    document: Document;
}

export interface Document {
    pageno: string;
    pagesize: string;
    total_count: string;
    records: Contrato[];
}

export interface Contrato {
    id: number;
    id_inmueble: number;
    des_corta: string;
    calle: string;
    id_arrendatario: number;
    noma: string;
    id_dueno: number;
    nomd: null;
    fecha_ini: Date;
    fecha_fin: Date;
    duracion: number;
    dpago: number;
    arriendo: number;
    garantia: number;
    otro: string;
    estado: number;
}

export interface Search {
    columnName: string;
    columnLogic: string;
    columnValue: string;
}
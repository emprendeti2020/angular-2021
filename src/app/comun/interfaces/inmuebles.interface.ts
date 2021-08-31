export interface InmuebleResponse {
    status: string;
    code: number;
    message: string;
    document: Document;
}

export interface Document {
    pageno: string;
    pagesize: string;
    total_count: string;
    records: Inmueble[];
}

export interface Inmueble {
    id: number;
    id_dependencia: string;
    id_tipo: string;
    des_corta: string;
    descripcion: string;
    calle: string;
    numero: string;
    comuna: string;
    depto: null;
    bodega: null;
    estacionamiento: null;
    rol: null;
    c_luz: null;
    c_agua: null;
    c_gas: null;
    c_otro: null;
    id_arrendatario: null;
    nombre_arrendatario: null;
    id_dueno: null;
    nombre_dueno: null;
    id_contrato: null;
    estado: number;
}

export interface Search {
    columnName: string;
    columnLogic: string;
    columnValue: string;
}
export interface IncidenteResponse {
    status: string;
    code: number;
    message: string;
    document: Document;
}

export interface Document {
    pageno: string;
    pagesize: string;
    total_count: string;
    records: Incidente[];
}

export interface Incidente {
    id: number;
    id_inmueble: number;
    id_arrendatario: number;
    id_contrato: number;
    id_dueno: number;
    id_tipoincidente: number;
    id_estadoincidente: number;
    id_tecnico: number;
    fecha: Date;
    id_usuario: number;
    incidente: string;
    fecha01: null;
    obs01: null;
    fecha02: null;
    obs02: null;
    fecha03: null;
    obs03: null;
    nom_arrendatario: null;
    nom_dueno: null;
    des_corta: null;
    tipoincidente: null;
    estadoincidente: null;
    estado: number;
}

export interface Search {
    columnName: string;
    columnLogic: string;
    columnValue: string;
}
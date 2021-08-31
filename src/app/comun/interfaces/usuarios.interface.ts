export interface UsuarioResponse {
    status: string;
    code: number;
    message: string;
    document: Document;
}


export interface AuthResponse {
    status: string;
    code: number;
    message: string;
    document: DocumentAuth;
}

export interface Token {
    access_token: string;
    expires_in: number;
    token_type: string;
}

export interface Document {
    pageno: string;
    pagesize: string;
    total_count: string;
    records: Usuario[];
}

export interface Usuario {
    id: number;
    usuario: string;
    email: string;
    password: string;
    nombre: string;
    descripcion: string;
    id_rol: number;
    estado: number;
    access_token?: string;
    expires_in?: string;
    token_type?: string;
}

export interface DocumentAuth {
    id?: number;
    nombre?: string;
    email: string;
    usuario: string;
    password?: string;
    tipo?: number;
    estado: number;
    token: Token;
}

export interface Search {
    columnName: string;
    columnLogic: string;
    columnValue: string;
}


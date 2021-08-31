export interface ParametroResponse {
    status:   string;
    code:     number;
    message:  string;
    document: Document;
}

export interface Document {
    pageno:      string;
    pagesize:    string;
    total_count: string;
    records:     Parametro[];
}

export interface Parametro {
    id:     string;
    param:  string;
    des:    string;
    v1:     string;
    v2:     null;
    v3:     null;
    v4:     null;
    v5:     null;
    orden:     null;
    estado: number;
}

export interface Search {
    columnName:  string;
    columnLogic: string;
    columnValue: string;
}
export interface GgccResponse {
    status:   string;
    code:     number;
    message:  string;
    document: Document;
}

export interface Document {
    pageno:      string;
    pagesize:    string;
    total_count: string;
    records:     Ggcc[];
}

export interface Ggcc {
    depto       : number;
    base        : number;
    acaliente   : number;
    ecomunes    : number;
    multas      : number;
    total      ?: number;
}
 
export interface Search {
    columnName:  string;
    columnLogic: string;
    columnValue: string;
}

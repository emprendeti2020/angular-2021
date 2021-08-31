export interface respuesta<T> {
    "status": 'success'|'error'
    "code": number
    "message":string
    "document":document<T> 
}

export interface document<T> {
    "pageno": string,
    "pagesize": string,
    "total_count": number,
    "records" : T[]
}


export interface consulta {
    columnName:  string;
    columnLogic: string;
    columnValue: string;
}

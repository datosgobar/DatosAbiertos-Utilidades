interface ResultadoConsulta {
    urlPortal:string
}
interface ResponseValidacionCatalogo {
    detail: {loc:string[],msg:string,type:string}[]
}
export type {ResultadoConsulta,ResponseValidacionCatalogo};
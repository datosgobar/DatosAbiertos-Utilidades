interface Organization {
    name:string,
    highlighted:boolean,
    title:string,
    children:Organization[]
}
export type {Organization};
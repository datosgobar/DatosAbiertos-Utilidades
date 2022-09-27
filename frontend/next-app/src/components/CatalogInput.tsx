import InputTypeText from "./InputTypeText";
import InputTypeFile from "./InputTypeFile";
import React from "react";

type Props = {

    metodo: "file"|"url"
}
const CatalogInput = ({metodo}:Props ) => {
    if(metodo=="file") {
        return <InputTypeFile label={"Catálogo a validar"} placeholder={"Subir archivo correspondiente al catálogo"} required={true}  id={"file"}/>

    }else if(metodo=='url'){
       return <InputTypeText placeholder={"Ingresar URL"} label={"URL del portal que contiene el catálogo a validar"} required={true} id={"url"}/>
    }
    return <></>;
}

export default CatalogInput;
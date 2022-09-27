import React from "react";
import ApiSeriesValidationResponse from "../models/ApiSeriesValidationResponse";



type Props = {
    messages:string[]
}
const ContainerResultado =  ({messages}:Props) => {
    if(messages==undefined){
        return <></>
    }
     if(messages.length==0) {
        messages=["La distribución cargada no tiene errores"]
     }
         return <div className={"col-md-8 col-md-offset-2"}>
             <h4>Resultados de la operación:</h4>
             <div className='alert alert-success'>
                 <div className="alert alert-danger">
                     {messages.map((issues) => {
                             return <p>{issues}</p>
                         }
                     )}
                 </div>
             </div>
         </div>
};

export default ContainerResultado;
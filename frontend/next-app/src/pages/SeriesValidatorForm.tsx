import React, {FormEventHandler, useState} from "react";
import type { ReactElement } from 'react'

import type { NextPageWithLayout } from '../pages/_app'

import BaseFormLayout from "../components/BaseFormLayout";
import InputTypeSelect from "../components/InputTypeSelect";
import InputTypeText from "../components/InputTypeText";
import CustomSubmitButton from "../components/FormSubmitButton";
import Layout from "../components/layout";
import {Organization} from "../models/organzationModels";
import {ResultadoConsulta} from "../models/ResultadoConsulta";
import ContainerResultado from "../components/ContainerResultado";
const OPTIONS = [
    { name:"JSON" ,value: "JSON"},
    { name:"XLSX" ,value: "XLSX"},

];
interface ResultadoSeriesValidator extends ResultadoConsulta{
    errors: string[],
}
//TODO: actualmente la api de series esta tirando 502 (bad gateway)
const SeriesValidatorForm: NextPageWithLayout = () => {
    const [resultadoConsulta ,setResultadoConsulta]:[ResultadoSeriesValidator,Function ]= useState({errors:undefined,urlPortal:""});
    const handleSubmit:FormEventHandler = async (event)=>{
        let url:HTMLInputElement = document.getElementById("url") as HTMLInputElement;
        let distribution_id:HTMLInputElement = document.getElementById("dist_id") as HTMLInputElement;
        let format:HTMLInputElement = document.getElementById("format") as HTMLInputElement;
        event.preventDefault();
        const data = {
            catalog_url:  url.value,
            distribution_id: distribution_id.value,
            format: format.value
        }
        //TODO: esta pagina se podria eliminar y redirigir desde la card del index hacia la github page que ya contiene este formulario (proyecto series-validator)
        const response= await fetch('http://apis.datos.gob.ar/series/api/validate/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }
        );
        try {
            if(response.status==200){
                let result = await response.json();
                setResultadoConsulta({...resultadoConsulta,errors:result.detail});
            }else{
                setResultadoConsulta({...resultadoConsulta,errors:["Error response: Status "+response.status.toString()]});
            }
        }catch (e){
            setResultadoConsulta({...resultadoConsulta,errors:[e.message]})
        }

    }
    return  <>
            <form onSubmit={handleSubmit}>

                <InputTypeText placeholder={""} label={"URL del catálogo"} required={true} id={"url"}/>
                <InputTypeSelect label={"Formato"} placeholder={""} required={true} options_list={OPTIONS} id={"format"} onSelect={undefined}/>
                <InputTypeText label={"Identificador de distribución"} placeholder={""} required={true} id={"dist_id"}/>

                 <CustomSubmitButton label={"VALIDAR"} />
            </form>
            <ContainerResultado messages={resultadoConsulta?.errors}></ContainerResultado>
            </>

}

SeriesValidatorForm.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            <BaseFormLayout title={"Validación de distribuciones de series de tiempo"} >
                {page}
            </BaseFormLayout>
        </Layout>
    )
}

export default SeriesValidatorForm;




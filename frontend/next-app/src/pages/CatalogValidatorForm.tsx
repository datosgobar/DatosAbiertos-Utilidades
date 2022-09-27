import React, {FormEventHandler, useState} from "react";
import type { ReactElement } from 'react'

import type { NextPageWithLayout } from '../pages/_app'

import BaseFormLayout from "../components/BaseFormLayout";
import InputTypeSelect from "../components/InputTypeSelect";
import InputTypeText from "../components/InputTypeText";
import CustomSubmitButton from "../components/FormSubmitButton";
import Layout from "../components/layout";
import InputTypeFile from "../components/InputTypeFile";
import {Organization} from "../models/organzationModels";
import {ResultadoConsulta} from "../models/ResultadoConsulta";
import CatalogInput from "../components/CatalogInput";
import ContainerResultado from "../components/ContainerResultado";
interface ResultadoCatalogValidation extends ResultadoConsulta{
    errors: string[],
    metodo: "file"|"url"

}
const OPTIONS = [
    {name:"",value:''},
    {name:"Archivo",value:'file'},
    {name:"url de portal",value:"url"}
];
const CatalogValidatorForm: NextPageWithLayout = () => {
    const [resultadoConsulta ,setResultadoConsulta]:[ResultadoCatalogValidation,Function ]= useState({errors:undefined,urlPortal:"",metodo:undefined});
    const handleMethodElection:FormEventHandler = async (event)=>{
        event.preventDefault();
        let selectedOption = document.getElementById("metodo") as HTMLInputElement;
        setResultadoConsulta({...resultadoConsulta,metodo:selectedOption.value as "file"|"url"})

    }
    const handleSubmit:FormEventHandler = async (event)=>{
        let url:HTMLInputElement = document.getElementById("url") as HTMLInputElement;
        let file:HTMLInputElement = document.getElementById("file") as HTMLInputElement;
        event.preventDefault();
        const data = {
            origin_url:  url.value,
        }
        let queryString = new URLSearchParams(data).toString();
        const formData = new FormData();
        formData.append('file',file?.files?.item(0));
        let response;
        if(resultadoConsulta.metodo=='file') {
            response = await fetch('/portal/catalog/is_valid?' + queryString, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        "Content-type": "application/json"
                    }
                }
            );
        }else{
            response = await fetch('/portal/catalog/is_valid?' + queryString, {
                    method: 'POST',
                    headers: {
                        "Content-type": "application/json"
                    }
                }
            );
        }
        try {
            let result = await response.json();

            setResultadoConsulta({...resultadoConsulta,errors:[result?'El catálogo es válido':'El catálogo no es válido'],urlPortal:data.origin_url});
        }catch (e){
            setResultadoConsulta({...resultadoConsulta,errors:[e.errors],urlPortal:data.origin_url})
        }

    }
    return   <>
        <form onSubmit={handleSubmit}>

            <InputTypeSelect label={"metodo"} placeholder={"Elija el método de subida de catálogo"} required={true} options_list={OPTIONS} onSelect={handleMethodElection} id={'metodo'}/>

            <CatalogInput metodo={resultadoConsulta.metodo}/>

        <CustomSubmitButton label={"VALIDAR"} />
        </form>
        <ContainerResultado messages={resultadoConsulta.errors}></ContainerResultado>
    </>

}


CatalogValidatorForm.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            <BaseFormLayout title={"Validación de catálogos"}>
                {page}
            </BaseFormLayout>
        </Layout>
    )
}

export default CatalogValidatorForm;




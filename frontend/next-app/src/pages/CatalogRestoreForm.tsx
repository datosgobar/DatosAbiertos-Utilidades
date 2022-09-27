import React, {FormEventHandler, useState} from "react";
import type { ReactElement } from 'react'

import type { NextPageWithLayout } from '../pages/_app'

import BaseFormLayout from "../components/BaseFormLayout";
import InputTypeSelect from "../components/InputTypeSelect";
import InputTypeText from "../components/InputTypeText";
import CustomSubmitButton from "../components/FormSubmitButton";
import Layout from "../components/layout";
import InputTypeFile from "../components/InputTypeFile";
import {ResultadoConsulta, ResponseValidacionCatalogo} from "../models/ResultadoConsulta";
import CatalogInput from "../components/CatalogInput";
import {render} from "react-dom";
import ContainerResultado from "../components/ContainerResultado";
const OPTIONS = [
    {name:"",value:""},
    {name:"Archivo",value:'file'},
    {name:"url de portal",value:"url"},
];
interface ResultadoCatalogRestore extends ResultadoConsulta{
    errors: string[],
    metodo: "file"|"url"
}



const CatalogRestoreForm: NextPageWithLayout = () => {
    const [resultadoConsulta ,setResultadoConsulta]:[ResultadoCatalogRestore,Function ]= useState({errors:undefined,urlPortal:"",metodo:undefined});
    const handleMethodElection:FormEventHandler = async (event)=>{
        event.preventDefault();
        let selectedOption = document.getElementById("metodo") as HTMLInputElement;
        setResultadoConsulta({...resultadoConsulta,metodo:selectedOption.value as "file"|"url"})

    }
    const handleSubmit:FormEventHandler = async (event)=>{
        let url_origen:HTMLInputElement = document.getElementById("url") as HTMLInputElement;
        let url_destino:HTMLInputElement = document.getElementById("url-destino") as HTMLInputElement;
        let api_key:HTMLInputElement = document.getElementById("apikey") as HTMLInputElement;
        let metodo:HTMLInputElement = document.getElementById("metodo") as HTMLInputElement;
        let file:HTMLInputElement = document.getElementById("file") as HTMLInputElement;
        event.preventDefault();
        let data
        if(metodo.value=='file') {
             data = {
                // origin_url:  url_origen.value,
                destination_url: url_destino.value,
                apikey: api_key.value,
            }
        }else{
             data = {
                origin_url:  url_origen.value,
                destination_url: url_destino.value,
                apikey: api_key.value,
            }
        }
        let queryString = new URLSearchParams(data).toString();
        let response;
        if(metodo.value=='file'){
            const formData = new FormData();
            formData.append('file',file.files.item(0));
         response= await fetch('/portal/catalog/restore?'+queryString, {
                method: 'POST',
                headers: {
                 "Content-type": "application/json"
                },
                body: formData
            });
        }else{
            response= await fetch('/portal/catalog/restore?'+queryString, {
                method: 'POST',
                headers: {
                    "Content-type": "application/json"
                }
            });
        }
        try {
            let result :ResponseValidacionCatalogo= await response.json();
            if(result.detail){
                setResultadoConsulta({
                    ...resultadoConsulta,
                    // errors: [result.detail[0].loc.toString(),result.detail[0].msg,result.detail[0].type],
                    errors: [JSON.stringify(result.detail)],
                    urlPortal: data.origin_url
                });
            }else {
                setResultadoConsulta({
                    ...resultadoConsulta,
                    errors: JSON.parse(result.detail[0].msg) as unknown as string[],
                    urlPortal: data.origin_url
                });
            }
            }catch (e){
            setResultadoConsulta({...resultadoConsulta,errors:[],urlPortal:data.origin_url})
        }

    }
    return   <>
        <form onSubmit={handleSubmit}>
            <InputTypeSelect label={"metodo"} placeholder={"Elija el método de subida de catálogo"} required={true} options_list={OPTIONS} onSelect={handleMethodElection} id={'metodo'}/>

            <CatalogInput metodo={resultadoConsulta.metodo}/>

        <InputTypeText placeholder={""} label={"URL del portal  CKAN de  destino"} required={true} id={"url-destino"}/>
        <InputTypeText placeholder={""} label={"APIkey de un usuario con permisos que le permitan  crear o editar  un  dataset"} required={true} id={"apikey"}/>


        <CustomSubmitButton label={"VALIDAR"} />
        </form>
        <ContainerResultado messages={resultadoConsulta.errors}/>
    </>

}

CatalogRestoreForm.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            <BaseFormLayout title={"Restauración de Catálogos"} >
                {page}
            </BaseFormLayout>
        </Layout>
    )
}

export default CatalogRestoreForm;




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
const OPTIONS = [
    { name:"JSON" ,value: "JSON"},
    { name:"XLSX" ,value: "XLSX"},

];
interface ResultadoCatalogRestore extends ResultadoConsulta{
    errors: string[],
}
const CatalogRestoreForm: NextPageWithLayout = () => {
    const [resultadoConsulta ,setResultadoConsulta]:[ResultadoCatalogRestore,Function ]= useState({errors:undefined,urlPortal:""});
    const handleSubmit:FormEventHandler = async (event)=>{
        let url_origen:HTMLInputElement = document.getElementById("url-origen") as HTMLInputElement;
        let url_destino:HTMLInputElement = document.getElementById("url-destino") as HTMLInputElement;
        let api_key:HTMLInputElement = document.getElementById("apikey") as HTMLInputElement;
        let file:HTMLInputElement = document.getElementById("file") as HTMLInputElement;
        event.preventDefault();
        const data = {
            origin_url:  url_origen.value,
            destination_url:  url_destino.value,
            apikey: api_key.value,
        }
        let queryString = new URLSearchParams(data).toString();
        const formData = new FormData();
        formData.append('file',file.files.item(0));
        // evaluar  si linkear la otra pag a esta(es decir ekliminar esta page, dejar solo card con link) y dejar ambas online para no trabajar de mas.
        const response= await fetch('/portal/catalog/restore?'+queryString, {
                method: 'POST',
                body: formData
            }
        );
        try {
            let result = await response.json();

            setResultadoConsulta({organizations:JSON.parse(JSON.stringify(result)) as unknown as Organization[],urlPortal:data.origin_url});
        }catch (e){
            setResultadoConsulta({organizations:[],urlPortal:data.origin_url})
        }

    }
    return   <>
        <form onSubmit={handleSubmit}>

        <InputTypeFile label={"El catálogo de origen que se restaura"} placeholder={"asd"} required={true} id={"file"}></InputTypeFile>
        <InputTypeText placeholder={""} label={"URL del portal  CKAN de  origen"} required={true} id={"url-origen"}/>
        <InputTypeText placeholder={""} label={"URL del portal  CKAN de  destino"} required={true} id={"url-destino"}/>
        <InputTypeText placeholder={""} label={"APIkey de un usuario con permisos que le permitan  crear o editar  un  dataset"} required={true} id={"apikey"}/>


        <CustomSubmitButton label={"VALIDAR"} />
        </form>
        <div>
            {resultadoConsulta.errors.toString()}
        </div>
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




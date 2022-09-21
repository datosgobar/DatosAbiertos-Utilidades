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
const OPTIONS = [
    { name:"JSON" ,value: "JSON"},
    { name:"XLSX" ,value: "XLSX"},

];
interface ResultadoSeriesValidator extends ResultadoConsulta{
    errors: string[],
}
const SeriesValidatorForm: NextPageWithLayout = () => {
    const [resultadoConsulta ,setResultadoConsulta]:[ResultadoSeriesValidator,Function ]= useState({errors:undefined,urlPortal:""});
    const handleSubmit:FormEventHandler = async (event)=>{
        let url:HTMLInputElement = document.getElementById("url_portal") as HTMLInputElement;
        event.preventDefault();
        const data = {
            url:  url.value
        }
        let queryString = new URLSearchParams(data).toString();
        // evaluar  si linkear la otra pag a esta(es decir ekliminar esta page, dejar solo card con link) y dejar ambas online para no trabajar de mas.
        const response= await fetch('/portal/organizations?'+queryString, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        try {
            let result = await response.json();

            setResultadoConsulta({organizations:JSON.parse(JSON.stringify(result)) as unknown as Organization[],urlPortal:data.url});
        }catch (e){
            setResultadoConsulta({organizations:[],urlPortal:data.url})
        }

    }
    return  <>
            <form onSubmit={handleSubmit}>

                <InputTypeText placeholder={""} label={"URL del catálogo"} required={true} id={"url"}/>
                <InputTypeSelect label={"Formato"} placeholder={""} required={true} options_list={OPTIONS}/>


                 <CustomSubmitButton label={"VALIDAR"} />
            </form>
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




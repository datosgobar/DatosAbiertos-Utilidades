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
interface ResultadoCatalogValidation extends ResultadoConsulta{
    errors: string[],
}
const CatalogValidatorForm: NextPageWithLayout = () => {
    const [resultadoConsulta ,setResultadoConsulta]:[ResultadoCatalogValidation,Function ]= useState({errors:undefined,urlPortal:""});
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
        const response= await fetch('/portal/catalog/is_valid?'+queryString, {
                method: 'POST',
                body: formData
            }
        );
        try {
            let result = await response.json();

            setResultadoConsulta({errors:JSON.parse(JSON.stringify(result)) as unknown as string[],urlPortal:data.origin_url});
        }catch (e){
            setResultadoConsulta({errors:[],urlPortal:data.origin_url})
        }

    }
    return   <>
        <form onSubmit={handleSubmit}>



        <CustomSubmitButton label={"VALIDAR"} />
        </form>
    </>

}


CatalogValidatorForm.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            <BaseFormLayout title={"Restauración de catálogos"}>
                {page}
            </BaseFormLayout>
        </Layout>
    )
}

export default CatalogValidatorForm;




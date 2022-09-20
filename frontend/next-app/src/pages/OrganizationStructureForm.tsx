import React, {FormEventHandler, ReactNode, useState} from "react";
import type { ReactElement } from 'react'

import type { NextPageWithLayout } from '../pages/_app'

import BaseFormLayout from "../components/BaseFormLayout";
import InputTypeText from "../components/InputTypeText";
import CustomSubmitButton from "../components/FormSubmitButton";
import Layout from "../components/layout";
import Card from "../components/Card";
import {Organization} from "../models/organzationModels";
import OrganizationTreeResult from "../components/OrganizationTreeResult";
// import  "../styles/styles-andino-theme/sass/organization/index.scss" ;


interface ResultadoConsulta {
    organizations: Organization[],
    urlPortal:string
}

const OrganizationStructureForm: NextPageWithLayout = () => {
    const [resultadoConsulta ,setResultadoConsulta]:[ResultadoConsulta,Function ]= useState({organizations:undefined,urlPortal:""});
    const handleSubmit:FormEventHandler = async (event)=>{
        console.log('ya hice request y este es elñ resuilt');
        let url:HTMLInputElement = document.getElementById("url_portal") as HTMLInputElement;
        event.preventDefault();
        const data = {
            url:  url.value
        }
        const JSONdata = JSON.stringify(data);
        // let ApiUrl = new URL('/portal/organizations');
        let queryString = new URLSearchParams(data).toString();
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

    return <>
            <form onSubmit={handleSubmit}>
                <InputTypeText id={"url_portal"} placeholder={""} label={"URL del portal"} required={true}/>

                <CustomSubmitButton label={"CONSULTAR"} />
                <OrganizationTreeResult organizationList={resultadoConsulta.organizations} urlPortal={resultadoConsulta.urlPortal}/>

            </form>
        </>


}



OrganizationStructureForm.getLayout = function getLayout(page: ReactElement) {

    return (
        <Layout>
            <BaseFormLayout title={"Consulta de estructura de organizaciones"} >
                {page}
            </BaseFormLayout>
        </Layout>
    )
}



export default OrganizationStructureForm;





import styles from '../styles/Home.module.css'
import React from "react";
import type { ReactElement } from 'react'

import type { NextPageWithLayout } from '../pages/_app'

import BaseFormLayout from "../components/BaseFormLayout";
import InputTypeSelect from "../components/InputTypeSelect";
import InputTypeText from "../components/InputTypeText";
import CustomSubmitButton from "../components/FormSubmitButton";
import Layout from "../components/layout";

const OrganizationStructureForm: NextPageWithLayout = () => {


    return   <>

        <InputTypeText id={"url_portal"} placeholder={""} label={"URL del portal"} required={true}/>

    <CustomSubmitButton label={"CONSULTAR"} />
    <div>{result}</div>
    </>

}
const handleSubmit = async (event)=>{
    console.log('ya hice request y este es elñ resuilt');

    event.preventDefault();
    const data = {
        url: event.target.url_portal
    }
    const JSONdata = JSON.stringify(data);
    let url = new URL('http://fastAPI/portal/organizations');
    url.search = new URLSearchParams(data).toString();

    const response= await fetch(url);
    result = await response.json();
    console.log('ya hice request y este es elñ resuilt');
    console.log(result);
}
let result:string="resultado default";

OrganizationStructureForm.getLayout = function getLayout(page: ReactElement) {

    return (
        <Layout>
            <BaseFormLayout title={"Consulta de estructura de organizaciones"} onSubmit={handleSubmit}>
            {page}
            </BaseFormLayout>
            </Layout>
    )
}

export default OrganizationStructureForm;




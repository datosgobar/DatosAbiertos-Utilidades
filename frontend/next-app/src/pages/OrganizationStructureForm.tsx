
import styles from '../styles/Home.module.css'
import React, {FormEventHandler, ReactNode} from "react";
import type { ReactElement } from 'react'

import type { NextPageWithLayout } from '../pages/_app'

import BaseFormLayout from "../components/BaseFormLayout";
import InputTypeSelect from "../components/InputTypeSelect";
import InputTypeText from "../components/InputTypeText";
import CustomSubmitButton from "../components/FormSubmitButton";
import Layout from "../components/layout";
import {GetStaticProps} from "next";

type Props = {
    url:string
}
const OrganizationStructureForm: NextPageWithLayout = ({url}:Props) => {


    return   <>

        <InputTypeText id={"url_portal"} placeholder={""} label={"URL del portal"} required={true}/>

    <CustomSubmitButton label={"CONSULTAR"} />
    <div>{result}</div>
    </>

}

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




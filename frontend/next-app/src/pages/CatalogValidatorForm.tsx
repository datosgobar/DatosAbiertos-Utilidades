
import styles from '../styles/Home.module.css'
import React from "react";
import type { ReactElement } from 'react'

import type { NextPageWithLayout } from '../pages/_app'

import BaseFormLayout from "../components/BaseFormLayout";
import InputTypeSelect from "../components/InputTypeSelect";
import InputTypeText from "../components/InputTypeText";
import CustomSubmitButton from "../components/FormSubmitButton";
import Layout from "../components/layout";
import InputTypeFile from "../components/InputTypeFile";
const OPTIONS = [
    { name:"JSON" ,value: "JSON"},
    { name:"XLSX" ,value: "XLSX"},

];
const CatalogValidatorForm: NextPageWithLayout = () => {
    return   <>

        <InputTypeText placeholder={""} label={"URL del portal que contiene el catálogoa validar"} required={true}/>
        <InputTypeFile label={"Catálogo a validar"} placeholder={""} required={true} options_list={OPTIONS}/>


        <CustomSubmitButton label={"VALIDAR"} />
    </>

}

CatalogValidatorForm.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            <BaseFormLayout title={"Validación de distribuciones de series de tiempo"}>
                {page}
            </BaseFormLayout>
        </Layout>
    )
}

export default CatalogValidatorForm;




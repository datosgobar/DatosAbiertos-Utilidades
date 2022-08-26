
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

const CatalogValidatorForm: NextPageWithLayout = () => {
    return   <>

        <InputTypeText placeholder={"Ingresar URL"} label={"URL del portal que contiene el catálogo a validar"} required={true}/>
        <InputTypeFile label={"Catálogo a validar"} placeholder={"Subir archivo correspondiente al catálogo"} required={true} />


        <CustomSubmitButton label={"VALIDAR"} />
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




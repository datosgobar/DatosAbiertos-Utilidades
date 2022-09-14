
import styles from '../styles/Home.module.css'
import React from "react";
import type { ReactElement } from 'react'

import type { NextPageWithLayout } from '../pages/_app'

import BaseFormLayout from "../components/BaseFormLayout";
import InputTypeSelect from "../components/InputTypeSelect";
import InputTypeText from "../components/InputTypeText";
import CustomSubmitButton from "../components/FormSubmitButton";
import Layout from "../components/layout";
const OPTIONS = [
    { name:"JSON" ,value: "JSON"},
    { name:"XLSX" ,value: "XLSX"},

];
const SeriesValidatorForm: NextPageWithLayout = () => {
    return   <>

                <InputTypeText placeholder={""} label={"URL del catálogo"} required={true} id={"url"}/>
                <InputTypeSelect label={"Formato"} placeholder={""} required={true} options_list={OPTIONS}/>


                 <CustomSubmitButton label={"VALIDAR"} />
            </>

}

SeriesValidatorForm.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            <BaseFormLayout title={"Validación de distribuciones de series de tiempo"} onSubmit={undefined}>
                {page}
            </BaseFormLayout>
        </Layout>
    )
}

export default SeriesValidatorForm;




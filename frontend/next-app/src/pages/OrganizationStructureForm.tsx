
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

        <InputTypeText placeholder={""} label={"URL del portal"} required={true}/>

    <CustomSubmitButton label={"CONSULTAR"} />
    </>

}

OrganizationStructureForm.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            <BaseFormLayout title={"Consulta de estructura de organizacione"}>
            {page}
            </BaseFormLayout>
            </Layout>
    )
}

export default OrganizationStructureForm;




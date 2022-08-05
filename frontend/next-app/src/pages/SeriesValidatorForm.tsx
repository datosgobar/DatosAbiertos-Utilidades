
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
    { name:"Documentation" ,value: "Find in-depth information about Next.js features and API"},
    { name:"Documentation2" ,value: "Find in-depth information about Next.js features and API"},
    { name:"Documentation3" ,value: "Find in-depth information about Next.js features and API"},
    { name:"Documentation4" ,value: "Find in-depth information about Next.js features and API"},

];
const SeriesValidatorForm: NextPageWithLayout = () => {
    return <div >
        <h1 className={styles.description}>
            formulario de validacion de series
        </h1>

        <div >
            <form>
                <InputTypeSelect label={""} placeholder={""} required={true} options_list={OPTIONS}/>

                <InputTypeText placeholder={""} label={""} required={true}/>

                <CustomSubmitButton label={"submit button"} />
            </form>
        </div>
    </div>

}

SeriesValidatorForm.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            <BaseFormLayout>
                {page}
            </BaseFormLayout>
        </Layout>
    )
}

export default SeriesValidatorForm;




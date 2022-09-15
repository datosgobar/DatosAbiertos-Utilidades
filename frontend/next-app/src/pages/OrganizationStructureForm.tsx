
import styles from '../styles/Home.module.css'
import React, {FormEventHandler, ReactNode, useState} from "react";
import type { ReactElement } from 'react'

import type { NextPageWithLayout } from '../pages/_app'

import BaseFormLayout from "../components/BaseFormLayout";
import InputTypeSelect from "../components/InputTypeSelect";
import InputTypeText from "../components/InputTypeText";
import CustomSubmitButton from "../components/FormSubmitButton";
import Layout from "../components/layout";
import  "../styles/styles-andino-theme/sass/organization/index.module.scss" ;


const OrganizationStructureForm: NextPageWithLayout = () => {
    const [resultadoConsulta,setResultadoConsulta] = useState("resultado default");
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
        let result = await response.json();
        console.log('ya hice request y este es elñ resuilt');
        console.log(result.toString());
        let prueba = "{\"highlighted\":false,\"children\":[{\"highlighted\":false,\"children\":[],\"id\":\"daa8b40c-fa37-478c-a7ef-081305aeadd8\",\"name\":\"aaip\",\"title\":\"Agencia de Acceso a la Información Pública\"},{\"highlighted\":false,\"children\":[],\"id\":\"b2509ac0-3af6-4f66-9ffa-8c6fb4206791\",\"name\":\"arsat\",\"title\":\"Empresa Argentina de Soluciones Satelitales\"},{\"highlighted\":false,\"children\":[],\"id\":\"6eb7d19b-2d42-494f-8e57-d67c501d23eb\",\"name\":\"enacom\",\"title\":\"Ente Nacional de Comunicaciones\"}],\"id\":\"f917ad65-28ea-42a9-81ae-61a2bb8f58d0\",\"name\":\"jgm\",\"title\":\" Jefatura de Gabinete de Ministros\"}"
        setResultadoConsulta(JSON.stringify(result));
    }

    return <>
            <form onSubmit={handleSubmit}>
                <InputTypeText id={"url_portal"} placeholder={""} label={"URL del portal"} required={true}/>

                <CustomSubmitButton label={"CONSULTAR"} />
                <div className={"organization"}>
                    <div className={"organization-list"}>
                        <div className={"organization-list-title"}>
                            <span>Organizacion</span>
                            <span className={"count-title"}>Datasets totales</span>
                        </div>
                        <div className={"organization-branch"}>
                           <div className={"organization-name top-organization"}>
                               <svg fill="#000000" height="24" viewBox="0 0 24 24" width="24"
                                    xmlns="http://www.w3.org/2000/svg" className="chevron-right">
                                   <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
                               </svg>
                               <a href="/dataset?organization=jgm">Jefatura de Gabinete de Ministros (22)</a>
                           </div>
                            <span className={"organization-count"}>84</span>
                            <div className={"organization-branch"}>
                                <div className={"organization-name"}>
                                    <a href="/dataset?organization=aaip">Agencia de Acceso a la Información Pública (2)</a>
                                </div>
                            </div>
                            <div className={"organization-branch"}>
                                <div className={"organization-name"}>
                                    <a href="/dataset?organization=aaip">Empresa Argentina de Soluciones Satelitales (8)</a>
                                </div>
                            </div>
                            <div className={"organization-branch"}>
                                <div className={"organization-name"}>
                                    <a href="/dataset?organization=aaip">Ente Nacional de Comunicaciones (52)</a>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
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




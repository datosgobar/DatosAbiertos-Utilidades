// @ts-ignore
import styles from '../styles/Home.module.css';
import React from "react";
import type { ReactElement } from 'react'
import Layout from '../components/layout'
import type { NextPageWithLayout } from './_app'
import Card from "../components/Card";

const CARD_LIST = [
    { title:"Documentation" ,text: "Find in-depth information about Next.js features and API", href: "https://nextjs.org/docs" ,active:true},
    { title:"Generador de Componentes" ,text: "Herramienta para formatear y previsualizar componentes, exportando luego el código html equivalente.", href: "https://nextjs.org/learn" ,active:true},
    { title:"Consultar  estructura de organizaciones" ,text: "Herramienta para consultar el árbol de una organización", href: "/OrganizationStructureForm" ,active:true},
    { title:"Restaurar Catálogos" ,text: "Herramienta para restaurar catálogos", href: "/CatalogRestoreForm" ,active:true},
    { title:"Series de tiempo" ,text: "Validador de series de tiempo", href: "/SeriesValidatorForm" ,active:true},
    { title:"Validar Catálogos" ,text: "Herramienta para validar catálogos", href: "/CatalogValidatorForm" ,active:true},
];
const HomePage: NextPageWithLayout = () => {
  return <div>
          <h1 className={styles.title}>
           Bienvenido a PyDataTools !
          </h1>

          <div className={styles.grid}>
              {CARD_LIST.map((card,idx) => (

                      <Card {...card} key={idx} />

              ))}
          </div>
        </div>

}


HomePage.getLayout = function getLayout(page: ReactElement) {
  return (
      <Layout>
        {page}
      </Layout>
  )
}

export default HomePage;




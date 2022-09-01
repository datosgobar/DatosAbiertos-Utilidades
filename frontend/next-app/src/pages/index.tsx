import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Navbar from "../components/NavBar";
import React from "react";
import type { ReactElement } from 'react'
import Layout from '../components/layout'
import NestedLayout from '../components/nested-layout'
import type { NextPageWithLayout } from './_app'
import Card from "../components/Card";
import NavItem from "../components/NavItem";
import {GetStaticProps} from "next";
const CARD_LIST = [
    { title:"Documentation" ,text: "Find in-depth information about Next.js features and API", href: "https://nextjs.org/docs" ,active:true},
    { title:"Learn" ,text: "Learn about Next.js in an interactive course with quizzes!", href: "https://nextjs.org/learn" ,active:true},
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




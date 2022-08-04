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
import InputTypeSelect from "../components/InputTypeSelect";
import InputTypeText from "../components/InputTypeText";
import CustomSubmitButton from "../components/CustomSubmitButton";
const CARD_LIST = [
    { title:"Documentation" ,text: "Find in-depth information about Next.js features and API", href: "https://nextjs.org/docs" ,active:true},
    { title:"Learn" ,text: "Learn about Next.js in an interactive course with quizzes!", href: "https://nextjs.org/learn" ,active:true},
    { title:"Examples" ,text: "Discover and deploy boilerplate example Next.js projects.", href: "https://github.com/vercel/next.js/tree/master/examples" ,active:true},
    { title:"Deploy" ,text: "Instantly deploy your Next.js site to a public URL with Vercel.", href: "https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app" ,active:true},
    { title:"una card extra" ,text: "TOOL1", href: "/tool1" ,active:true},
    { title:"dos cards extras" ,text: "TOOL2", href: "/tool2" ,active:true},
];
const SeriesValidatorFormPage: NextPageWithLayout = () => {
    return <div >
        <h1 className={styles.description}>
            formulario de validacion de series
        </h1>

        <div >
            <form>
                <InputTypeSelect>

                </InputTypeSelect>
                <InputTypeText>

                </InputTypeText>
                <CustomSubmitButton label={"unalabel"}></CustomSubmitButton>
            </form>
        </div>
    </div>

}

SeriesValidatorFormPage.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}

export default SeriesValidatorFormPage;




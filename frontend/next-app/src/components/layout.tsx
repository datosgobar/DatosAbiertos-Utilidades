import styles from "../styles/Home.module.css";
import Navbar from "./NavBar";
import Head from "next/head";
import Image from "next/image";
import React, {ReactNode} from "react";
import Footer from "./Footer";

type Props = {
    children?: ReactNode
    title?: string
}

const Layout = ({ children, title = 'This is the default title' }: Props) =>{
    return (
        <>
        <Head>
            <title>{title}</title>
            <link rel="icon" href="/favicon.ico" />
            <meta charSet="utf-8" />
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <Navbar/>

        <main className={styles.main}>
            {children}
        </main>

        <Footer/>
    </>)
}
export default Layout;
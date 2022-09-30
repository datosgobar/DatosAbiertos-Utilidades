import styles from "../styles/Home.module.css";
import Navbar from "./NavBar";
import Head from "next/head";
import Image from "next/image";
import React, {ReactNode} from "react";
import Footer from "./Footer";

type Props = {
    children?: ReactNode
    // title?: string
}

const Layout = ({ children }: Props) =>{
    return (
        <div className={"flex-wrapper"}>
        <Navbar/>

        <main className={styles.main}>
            {children}
        </main>

        <Footer/>
    </div>)
}
export default Layout;
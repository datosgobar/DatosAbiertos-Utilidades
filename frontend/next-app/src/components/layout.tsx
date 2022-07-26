import styles from "../styles/Home.module.css";
import Navbar from "./NavBar";
import Head from "next/head";
import Image from "next/image";
import React, {ReactNode} from "react";

type Props = {
    children?: ReactNode
    title?: string
}

const Layout = ({ children, title = 'This is the default title' }: Props) =>{
    return (
        <div>
        <Head>
            <title>{title}</title>
            <link rel="icon" href="/favicon.ico" />
            <meta charSet="utf-8" />
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
            <div>
        <Navbar/>
            </div>
        <main className={styles.main}>
            {children}
        </main>

        <footer className={styles.footer}>
            <a
                href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
            >
                Powered by{' '}
                <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
            </a>
        </footer>
    </div>)
}
export default Layout;
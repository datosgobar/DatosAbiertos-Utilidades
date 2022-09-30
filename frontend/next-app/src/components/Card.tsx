import Link from "next/link";
import styles from "../styles/card.module.css";
import React from "react";
type Props = {
    title: string
    text: string
    href: string
}
const Card = ({ title , text, href }) => {
    return (
        <Link  href={href}>
            <a href={href} className={styles.card}>
                <h3>{title} &rarr;</h3>
                <p>{text}</p>
            </a>
        </Link>
    );
};

export default Card;
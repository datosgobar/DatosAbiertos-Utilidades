import Link from "next/link";
import styles from "../styles/card.module.css";
import React from "react";
const Card = ({ title , text, href, active }) => {
    return (
        <Link href={href}>
            <a href={href} className={styles.card}>
                <h3>{title} &rarr;</h3>
                <p>{text}</p>
            </a>
        </Link>
    );
};

export default Card;
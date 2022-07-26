import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import  NavItem  from "./NavItem";
import navbarStyles from "../styles/navbar.module.css"
const MENU_LIST = [
    { text: "INICIO", href: "/home" },
    { text: "IDENTIDAD", href: "/identidad" },
    { text: "COMPONENTES", href: "/componentes" },
    { text: "PLANTILLAS", href: "/plantillas" },
];
const Navbar = () => {
    const [navActive, setNavActive] = useState(null);
    const [activeIdx, setActiveIdx] = useState(-1);
    return (
        <header className={navbarStyles.header} >
            <nav
                className={`nav active`}
            >
                <div onClick={() => setNavActive(!navActive)}>
                </div>
                <div >
                    {MENU_LIST.map((menu, idx) => (
                        <div
                            onClick={() => {
                                setActiveIdx(idx);
                                setNavActive(false);
                            }}
                            key={menu.href}
                        >
                            <NavItem {...menu} active={idx === activeIdx} />
                        </div>
                    ))}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
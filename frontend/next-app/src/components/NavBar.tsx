import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import  NavItem  from "./NavItem";
import navStyles  from  "../styles/navbar.module.css";

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

            <nav className="navbar navbar-top navbar-default  ">
                <div className="container">
                    <div className="navbar-header">
                        <a href="/" className="navbar-brand">
                            <img  src="../../../node_modules/ar-poncho/img/poncho.gif" height="50"></img>
                            <h1>PyDataTools</h1>
                        </a>
                    </div>
                    <div className="collapse navbar-collapse">
                        <ul className="nav navbar-nav navbar-right">
                            {MENU_LIST.map((menu, idx) => (
                                <div className="nav navbar-nav navbar-right"
                                     onClick={() => {
                                         setActiveIdx(idx);
                                         setNavActive(false);
                                     }}
                                     key={menu.href}
                                >
                                    <NavItem

                                        {...menu} active={idx === activeIdx} />

                                </div>
                            ))}
                        </ul>
                    </div>
                </div>
            </nav>
    );
};

export default Navbar;
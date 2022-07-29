import Link from "next/link";
import '../styles/navitem.module.css'
const NavItem = ({ text, href, active }) => {
    return (
        <li data-seccion={text}>
        <a href={href}>

                        {text}

         </a>
        </li>
    );
};

export default NavItem;
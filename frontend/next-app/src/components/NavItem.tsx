import Link from "next/link";
import '../styles/Home.module.css'
const NavItem = ({ text, href, active }) => {
    return (
        <Link href={href}>
            <a
                className={`nav__link active`}
            >
                {text}
            </a>
        </Link>
    );
};

export default NavItem;
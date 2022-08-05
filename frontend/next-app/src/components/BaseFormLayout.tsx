import styles from '../styles/Home.module.css'
import React, {ReactNode} from "react";


type Props = {
    children?: ReactNode
    title?: string
}

const BaseFormLayout = ({children,title='Default Title'}:Props) => {
    return <div >
        <h1 className={styles.description}>
            formulario de validacion de series
        </h1>

        <div >
            <form>
                {children}
            </form>
        </div>
    </div>

}

export default BaseFormLayout;




import styles from '../styles/Home.module.css'
import React, {FormEventHandler, ReactNode} from "react";


type Props = {
    children?: ReactNode
    title?: string,
    onSubmit: FormEventHandler,
}

const BaseFormLayout = ({children,title='Default Title',onSubmit}:Props) => {
    return <div className = "container">
        <div className="index-header">
            <h3 className="text-primary text-center">
                {title}
            </h3>
        </div>
        <div >
            <form onSubmit={onSubmit}>
                {children}
            </form>
        </div>
    </div>

}

export default BaseFormLayout;




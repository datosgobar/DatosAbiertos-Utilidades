import styles from '../styles/Home.module.css'
import React, {ReactNode} from "react";


type Props = {
    children?: ReactNode
    title?: string
}

const BaseFormLayout = ({children,title='Default Title'}:Props) => {
    return <div className = "container">
        <div className="index-header">
            <h3 className="text-primary text-center">
                {title}
            </h3>
        </div>
        <div >
            <form>
                {children}
            </form>
        </div>
    </div>

}

export default BaseFormLayout;




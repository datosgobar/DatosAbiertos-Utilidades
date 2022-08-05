import Link from "next/link";
import styles from "../styles/card.module.css";
import React, {ReactNode} from "react";
import NavItem from "./NavItem";
type Props = {
    label: string
    placeholder: string
    required:boolean
    options_list: {name:string,value:any}[],
}
const InputTypeSelect = ({label, placeholder='',required,options_list }:Props ) => {
    return (
        <div className={"form-group item-form"} >
            {/*id y name ==> label sin spaces*/}
            <label className={"form-label"} htmlFor={label.replace(/\s/g, '')}>{label}</label>
            <select
                id={label.replace(/\s/g, '')} name={label.replace(/\s/g, '')}
                required={required}
                placeholder={placeholder}
                className={"format form-control"}
            >
                {options_list.map((option,key = options_list.indexOf(option)) => (
                    <option>
                        name={option.name}
                        value={option.value}
                    </option>
                ))}
            </select>
        </div>
        );
};

export default InputTypeSelect;
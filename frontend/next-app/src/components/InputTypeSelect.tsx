import React, {FormEventHandler, ReactNode} from "react";
type Props = {
    label: string
    placeholder: string
    required:boolean
    options_list: {name:string,value:any}[],
    onSelect: FormEventHandler,
    id:string
}
const InputTypeSelect = ({label, placeholder='',required,options_list , onSelect=undefined,id}:Props ) => {
    return (
        <div className={"form-group item-form"} >
            {/*id y name ==> label sin spaces*/}
            <label className={"form-label"} htmlFor={label.replace(/\s/g, '')}>{label}</label>
            <select
                id={id}
                required={required}
                defaultValue={""}
                placeholder={placeholder}
                className={"format form-control"}
                onChange={onSelect}
            >
                {options_list.map((option,key = options_list.indexOf(option)) => (
                    <option value={option.value}>
                        {option.name}
                    </option>
                ))}
            </select>
        </div>
        );
};

export default InputTypeSelect;
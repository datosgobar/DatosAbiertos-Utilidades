import React from "react";
type Props = {
    label: string
    placeholder: string
    required:boolean
    id:string
}
const InputTypeText =  ({label , placeholder='',required,id}:Props) => {
    return (
        <div className={"form-group item-form"}>
            {/*id y name ==> label sin spaces*/}
            <label className={"form-label"} htmlFor={label.replace(/\s/g, '')}>{label}</label>
            <input type="text"
                   id={id} name={id}
                   required={required}
                   placeholder={placeholder}
                   className={"form-control"}
            />
        </div>
    );
};

export default InputTypeText;
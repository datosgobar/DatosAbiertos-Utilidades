import React from "react";
type Props = {
    label: string
    placeholder: string
    required:boolean
}
const InputTypeText =  ({label , placeholder='',required}:Props) => {
    return (
        <div className={"form-group item-form"}>
            {/*id y name ==> label sin spaces*/}
            <label className={"form-label"} htmlFor={label.replace(/\s/g, '')}>{label}</label>
            <input type="text"
                   id={label.replace(/\s/g, '')} name={label.replace(/\s/g, '')}
                   required={required}
                   placeholder={placeholder}
                   className={"form-control"}
            />
        </div>
    );
};

export default InputTypeText;
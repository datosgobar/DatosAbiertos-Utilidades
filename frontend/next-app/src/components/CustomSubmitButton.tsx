import React from "react";
const CustomSubmitButton =  (label:string) => {
    return (
        <div className={"form-group item-form"}>
            {/*id y name ==> label sin spaces*/}
            <input type="submit"
                   id={label.replace(/\s/g, '')} name={label.replace(/\s/g, '')}
                   className={"btn btn-primary"}
            />
        </div>
    );
};

export default CustomSubmitButton;
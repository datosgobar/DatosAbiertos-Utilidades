import React, {ReactHTML, ReactNode} from "react";
import {Organization} from "../models/organzationModels";
import TopOrganization from "./TopOrganization";



type Props = {
    organizationList: Organization[],
    urlPortal:string
}



const OrganizationTreeResult = ({organizationList,urlPortal}:Props ) => {
    if(organizationList!=undefined && organizationList[0]!=undefined)
        return (
            <div className={"organization-container"}>

                    <div className={"organization"}>

                        <div className={"organization-list"}>
                            <>
                            <div className={"organization-list-title"}>
                                <span>Organizacion</span>
                            </div>
                            {
                                organizationList.map(
                                    (child, idx) => {
                                    return <TopOrganization organization={child} urlPortal={urlPortal}></TopOrganization>
                                    }
                                )
                            }
                            </>
                        </div>
                    </div>

            </div>
        );
    else if(organizationList!=undefined && organizationList.length==0)
        return  (<div className={"organization-container"}>
                    <div className={"organization"}>
                        <div className={"organization-list"}>
                            <div className={"organization-list-title"}>
                                <span>No se han encontrado organizaciones cargadas en el portal indicado.</span>
                            </div>
                        </div>
                    </div>
                </div>       )
};

export default OrganizationTreeResult;
import {Organization} from "../models/organzationModels";
import OrganizationTreeResult from "./OrganizationTreeResult";
import React, {ReactElement} from "react";
import {List} from "immutable";

type Props = {
    organization: Organization,
    urlPortal:string
}
const ChildOrganization = ({organization,urlPortal}:Props) => {
    if(organization.children == undefined || organization.children.length == 0)
        return  <div className={"organization-branch"}>
                <div className={"organization-name"}>
                    <a href={urlPortal+"/dataset?organization="+organization.name}>{organization.title} ({organization.name})</a>
                </div>
            </div>
    else
        return <>
                {organization.children.map((child, idx) => {
                return <ChildOrganization organization={child} urlPortal={urlPortal}/>

                    })}
                </>
    }
    export default ChildOrganization;
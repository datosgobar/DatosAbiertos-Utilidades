import {Organization} from "../models/organzationModels";
import OrganizationTreeResult from "./OrganizationTreeResult";
import React, {ReactElement} from "react";
import {List} from "immutable";
import ChildOrganization from "./ChildOrganzation";

type Props = {
    organization: Organization,
    urlPortal:string

}
const TopOrganization = ({organization,urlPortal}:Props) => {
    return (
            <div className={"organization-branch"}>
                <>
                <div className={"organization-name top-organization"}>
                    <svg fill="#000000" height="24" viewBox="0 0 24 24" width="24"
                         xmlns="http://www.w3.org/2000/svg" className="chevron-right">
                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
                    </svg>
                    <a href={urlPortal+"/dataset?organization="+organization.name}>{organization.title} ({organization.name})</a>
                </div>
                <span className={"organization-count"}>{organization.highlighted}</span>
                {
                    organization.children.map((child, idx) => {
                        return <ChildOrganization organization={child} urlPortal={urlPortal}></ChildOrganization>
                    })
                }
                </>
            </div>

    )
}
export default TopOrganization;
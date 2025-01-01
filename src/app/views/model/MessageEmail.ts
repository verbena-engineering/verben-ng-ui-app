import { BaseModel } from "./base";

export interface MessageEmail extends BaseModel{
    id: string | number; 
    Checked:boolean
    MailHost:string,
    Enabled:boolean,
    Secured:boolean,
    User:string,
    Action:string,
    InboundHost:string,
    OutboundHost:string,
    Password:string,
    Mail:string[]
}
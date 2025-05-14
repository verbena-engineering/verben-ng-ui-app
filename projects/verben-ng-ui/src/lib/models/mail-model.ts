export interface MailPayload {
    subject:string
    body:string
    to:string[]
    cc?:string[]
    bcc?:string[]
    attachment:string|null;
}
import { Message } from "@/model/User.model";

export interface ApiResponse {
    sccuess: boolean,
    message: string,
    isAcceptingMessage?: boolean,
    messages?: Array<Message>
}
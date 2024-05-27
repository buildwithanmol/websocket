import { WebSocket } from "ws";
import { code } from "../utils";

export interface IUser {
    is_verified: boolean, 
    group_ids?: string[],
    ws: WebSocket
}

export class User {
    private user: Map<string, IUser>;

    constructor() {
        this.user = new Map<string, IUser>();
    }  

    create(user_id: string, ws: WebSocket) {
        const response = this.user.set( user_id, {is_verified: true, ws});
        if(!response) {
            return {message: 'User failed to create', success: false}
        }
        return {message: 'User created successfully', success: true}
    }

    verify(user_id: string) {
        if(!user_id){
            return {message: 'No user id provided', success: false}            
        }
        const is_user = this.user.has(user_id);

        if(!is_user) {
            return {message: 'User does not exists', success: false}
        } 

        return {message: 'User exists', success: true}
     }

     sendMessage(message: string, sender_id: string, user_id: string) {
        if(!sender_id) {
            return {message: 'No sender id!', success: false};
        };
        const sender = this.user.get(sender_id);

        if(!sender) {
            return {success: false, message: 'User does not exists with this id'}
        };

        sender.ws.send(code({
            data: message, 
            sent_by: user_id
        }))
     }

     addToGroup(user_id: string, group_id: string) {
        const user = this.user.get(user_id);

        if(!user) {
            return {success: false, message: user_id + ' does not exists'}
        }

        user.group_ids.push(group_id);
        return {message: 'Added to group sucessfully', success: true}
     }
}
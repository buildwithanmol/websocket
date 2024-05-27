import { WebSocket as WSType} from "ws";
import http from 'http'
import WebSocket from "ws";
import { MessageType } from "./types/types";
import { TokenExpiredError, verify } from "jsonwebtoken";
import { authorize, code } from "./utils";
import { User } from "./mangers/user";
import { Group } from "./mangers/group";

// Class Instantiation
const user = new User();
const group = new Group();

export const handleData = async (payload: MessageType
    , ws: WSType, wss: WebSocket.Server<typeof WebSocket, typeof http.IncomingMessage>) => {
    try {
        const { type, data } = payload;

        if (type === 'authenticate') {
            if (!data.session) {
                ws.close(1013, "No Session Provided");
                return
            }
            const decoded: any = verify(data.session, process.env.JWT_SECRET);

            if (!decoded) {
                ws.close(1013, 'Token not verified')
                return;
            };

            const { _id } = decoded;

            const response = user.create(_id, ws);

            if (!response.success) {
                ws.send(code({ message: response.message }))
                return;
            }

            ws.send(code({ message: response.message }))

        } else if (type === 'message') {
            authorize(user, data.user_id, ws);

            if(data.info.type === 'individual') {

                const sender_id = data.info.sender_id;

                const user_id = data.user_id;

                const response = user.sendMessage(data.message, sender_id, user_id);
                
                return {message: response.message, success: response.success};

            } else if(data.info.type === 'broadcast') {
                
            }  

        } else if (type === 'create-group') {   
            const {admin, name } = data;

            const response = group.create(name, admin, ws);

            if(!response.success) {
                ws.send(code({message: response.message}))
            };

            ws.send(code({message: response.message}))
            
        } else if(type === 'add-to-group') {
            const {user_id, group_id} = data;
            const user_response = user.addToGroup(user_id, group_id);
            const group_response  = group.addUserToGroup(user_id, group_id, ws);

            if(!user_response.success || !group_response.success) {
                ws.send(code({message: user_response.message  || group_response.message}))
                return;
            };

            ws.send(code({data: user_response.success && group_response.success ? ('Added to group') : 'Failed to add'}))
        }   

    } catch (error) {
        if (error instanceof TokenExpiredError) {
            ws.close(1013, 'Token Expired')
        }
        ws.close(1013, "Server Error");
    }
}
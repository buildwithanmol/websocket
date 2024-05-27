import { WebSocket } from "ws"

export type MessageType = {
    type: 'authenticate',
    data: {
        session: string
    }
} | {
    type: 'message',
    data: {
        user_id: string,
        message: string,
        info: { 
            type: 'broadcast', group_id: string 
        } |
        {
            type: 'individual', sender_id: string
        }
    }
} | {
    type: 'add-to-group', 
    data: {
        user_id: string,
        ws: WebSocket,
        group_id: string
    }
} | {
    type: 'create-group', 
    data: {
        name: string, 
        admin: string
    }
}
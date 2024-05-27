import { WebSocket } from "ws"
import { User } from "./mangers/user"

export const code = (data: { [key: string]: string }): string => {
    return JSON.stringify(data)
}

export const decode = (data: string) => {
    return JSON.parse(data)
}

export const authorize = (user: User, user_id: string, ws: WebSocket) => {

    const response = user.verify(user_id);

    if (!response.success) {
        ws.send(code({ message: response.message }));
        return;
    };

    ws.send(code({ message: response.message }));
}
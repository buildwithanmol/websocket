import {v4} from 'uuid';
import { WebSocket as WS } from 'ws';
import { code } from '../utils';

interface IGroup {
    users?: {user_id: string, ws: WS}[],
    name: string, 
    admin: string,
    adminWS: WS
}
export class Group {
    private group: Map<string, IGroup>;

    constructor() {
        this.group = new Map<string, IGroup>();
    };

    create(name: string, admin: string, adminWS: WS) {
        const id = v4();
        const group = this.group.set(id, {
            name, 
            admin,
            adminWS
        });
        if(!group) {
            return {success: false, message: 'Group failed to create'}
        };
        return {success: true, message: 'Group created successfully'};
    }

    addUserToGroup(user_id: string, group_id: string, ws: WS) {
        const group = this.group.get(group_id);
        if(!group) {
            return {success: false, message: 'Group with ' + group_id + ' does not exists'}
        };
        group.users.push({user_id, ws});
    return {message: 'Added to group successfully', success: true}
    }

    sendMessageToGroup(user_id: string, group_id: string, message: string) {
        const is_group = this.group.get(group_id);
        if(!is_group) {
            return {message: 'Group does not exists with this id', success: false}
        };
        is_group.users.map((client) => {
            client.ws.send(code({message, sent_by: user_id, group_id}))
        })
        return {message: 'Message sent successfully', success: true}
    }
}
import { WebSocketServer } from "ws";
import http from 'http';
import { code } from "./utils";
import { MessageType } from "./types/types";
import { handleData } from "./handler";
import { config } from "dotenv";

config();

const server = http.createServer((req, res) => {
    console.log((new Date()) + ' requested url ' +  req.url);

})

const wss = new WebSocketServer({server});

wss.on('connection', (ws) => {
    ws.on('close', () => {
        ws.send(code({message: 'Connection closed'}))
    });
    ws.on('message', (data: MessageType
    ) => handleData(data, ws, wss))
})
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const index_1 = require("./index");
class Game {
    send(roomId, score, data) {
        const room = index_1.rooms.find((x) => x.roomId === roomId);
        if (room) {
            room.users.forEach((user) => user.ws.emit("match", { score: score, data: data }));
        }
    }
}
exports.Game = Game;

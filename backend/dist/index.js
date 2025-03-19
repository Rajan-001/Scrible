"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rooms = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const wordGenerator_1 = require("./wordGenerator");
// import { prisma } from "./db/db"
exports.app = (0, express_1.default)();
const server = http_1.default.createServer(exports.app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
});
let round_count = 0;
exports.app.use(express_1.default.json());
exports.app.use((0, cors_1.default)({
    origin: "http://localhost:5173", // Replace with your frontend URL
    methods: ["GET", "POST"],
    credentials: true,
}));
exports.rooms = [];
io.on("connection", (socket) => {
    socket.on("connect room", (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, roomId } = data;
        let user = exports.rooms.find((x) => x.roomId === roomId);
        console.log(user);
        if (user) {
            const userDetail = { userId, ws: socket.id };
            user.users.push(userDetail);
        }
        else {
            const userDetail = { userId, ws: socket.id };
            const newRoom = { users: [userDetail], roomId };
            yield exports.rooms.push(newRoom);
        }
        // const user1 = prisma.user.create({
        //   data: {
        //     userId,
        //     total_match_won: 0,
        //   },
        // })
        let word = "";
        function fetchWord() {
            return __awaiter(this, void 0, void 0, function* () {
                word = yield (0, wordGenerator_1.wordGenerator)();
                console.log(word);
            });
        }
        yield fetchWord();
        data = {
            roomId: roomId,
            user: user,
            word: word
        };
        socket.join(roomId);
        io.to(roomId).emit("player-joined", data);
        if (round_count <= 3) {
            console.log(`started_Round ${exports.rooms} ${roomId} `);
            startround(exports.rooms, roomId, round_count);
        }
    }));
    function startround(rooms, roomId, round_count) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (round_count > 3) {
                console.log("Round completed Match over");
                return;
            }
            io.to(roomId).emit("start-round", { rooms, roomId });
            const painter = (_a = rooms.find((x) => x.roomId === roomId)) === null || _a === void 0 ? void 0 : _a.users[0];
            console.log(painter);
            const user_count = (_b = rooms.find((x) => x.roomId === roomId)) === null || _b === void 0 ? void 0 : _b.users.length;
            if (user_count && user_count >= 2) {
                io.to(roomId).emit("painter", painter);
                socket.on("sending-drawing", (data) => {
                    const painting = data;
                    console.log(painting);
                    io.to(roomId).emit("receiving-drawing", { painting });
                });
                socket.on("score-result", (data) => {
                    io.to(roomId).emit("final-score", { data });
                });
                //  round_count++;
                //   startround(rooms,roomId,user,round_count)
            }
        });
    }
});
server.listen(3002, () => {
    console.log("Server is listening on port 3003");
});

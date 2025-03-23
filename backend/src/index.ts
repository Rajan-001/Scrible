import express from "express"
import { Server, Socket } from "socket.io"
import http from "http"
import cors from "cors"
import { wordGenerator } from "./wordGenerator"
// import { prisma } from "./db/db"

export const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
})
let round_count=0
app.use(express.json())
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  })
)
interface userinfo {
  userId: string
  ws: string
  character:number
}
export interface Room {
  users: userinfo[]
  roomId: string
}
export const rooms: Room[] = []
io.on("connection", (socket) => {
 
  socket.on("connect room", async (data) => {
    const { userId, roomId,character } =data

    let user = rooms.find((x) => x.roomId === roomId)
    if (user) {
      const userDetail: userinfo = { userId, ws: socket.id,character }
      user.users.push(userDetail)
    } else {
      const userDetail: userinfo = { userId, ws: socket.id,character}
      const newRoom: Room = { users: [userDetail], roomId }
      await rooms.push(newRoom)
    }

    // const user1 = prisma.user.create({
    //   data: {
    //     userId,
    //     total_match_won: 0,
    //   },
    // })

    let word = ""
    async function fetchWord() {
      word = await wordGenerator()
      console.log(word)
    }
    await fetchWord()
  
   
    socket.join(roomId)
    const players=rooms.find((x) => x.roomId === roomId)?.users!
    const playersWithScore = await players.map(player => ({
      ...player,
      score: 0  
    }));
    data={
      roomId:roomId,
      user:user,
      word:word,
      playersWithScore:playersWithScore
    }
    console.log(data)
    io.to(roomId).emit("player-joined",data)
 console.log(`${JSON.stringify(players)} above one is user array`)
  if(round_count<=3){
    console.log(`started_Round ${rooms} ${roomId} `)
    startround(rooms,roomId,round_count)
    
  }
  })
  async function startround(rooms:Room[],roomId:string,round_count:number){
    if(round_count>3){
      console.log("Round completed Match over")
      return;
      }
      console.log(`Round count ${round_count}`)
 io.to(roomId).emit("start-round",{rooms,roomId})

 const painter=rooms.find((x) => x.roomId === roomId)?.users[0];
      console.log(painter)
      const user_count=rooms.find((x) => x.roomId === roomId)?.users.length;
    if(user_count&&user_count>=2)
    {
      io.to(roomId).emit("painter",painter)
      console.log(socket.on)
      socket.on("sending-drawing",(data)=>{
        const painting=data
        console.log(painting)
        io.to(roomId).emit("receiving-drawing",{painting})
      })
      socket.on("score-result",(data)=>{
console.log(`${data} Winner result`)
        io.to(roomId).emit("final-score",{data})
        
      })
    //  round_count++;
    //   startround(rooms,roomId,user,round_count)
     }}
})
server.listen(3004, () => {
  console.log("Server is listening on port 3003")
})


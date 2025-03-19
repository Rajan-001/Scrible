import { useEffect, useRef, useState } from "react"
import { useSocket } from "../Hook/Socket"
import { your_UserId } from "../Page/Landing_Page";

export function Game() {
  const [letter, setLetter] = useState()
  const [score, setScore] = useState(0)
  const [room,setRoomId]=useState({});
  const[users,setUsers]=useState()
  const[painter,setPainter]=useState()
  let players:[]=[]
  interface playerScore{
    userId:string,
    score:number
  }
  const scoreTable:playerScore[]=[]
  const inputRef = useRef(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const socket = useSocket()!

  useEffect(() => {
    
    const winner_score = 10
    let startX = 0
    let startY = 0
    const color = "white"
    // if (!socket) {
    //   return
    // }
    const c = canvasRef.current!
    if (!c.getContext) {
      return
    }
   
    const ctx = c.getContext("2d")!
    socket.on("player-joined", (data) => {
      const { roomId,user, word } = data
      console.log(socket.connected)
    console.log(`${data} player joined`)
    players=user
    setRoomId(roomId)
      setLetter(word)
    })

    socket.on("start-round",(data)=>{
      const {rooms,roomId}=data;
     
      setRoomId(roomId)
      console.log(JSON.stringify(rooms))
      // setUsers(room.data.users)
     socket.on("painter",(receieved_data)=>{
      setPainter(receieved_data.userId)
      
      console.log(`${receieved_data.userId==your_UserId} checking painter  ${receieved_data.userId} and userId ${your_UserId}`)
     if(receieved_data.userId==your_UserId)
        {
        let isMouseDown = true
        c.addEventListener("mousemove", handlemousemove)
        c.addEventListener("mouseup", handlemouseup)
        c.addEventListener("mousedown", handlemousedown)
    console.log("drawing started")
        function handlemousemove(event: MouseEvent) {
          if (isMouseDown) {
            drawLine(
              startX,
              startY,
              event.clientX || event.touches[0].clientX,
              event.clientY || event.touches[0].clientY,
              "white",
              true
            )
            startX = event.clientX
            startY = event.clientY
          }
        }
        function handlemouseup(event: MouseEvent) {
          isMouseDown = false
          drawLine(
            startX,
            startY,
            event.clientX || event.touches[0].clientX,
            event.clientY || event.touches[0].clientY,
            color,
            true
          )
        }
        function handlemousedown(e: MouseEvent) {
          isMouseDown = true
          startX = e.clientX || e.touches[0].clientX
          startY = e.clientY || e.touches[0].clientY
    
        }
        return()=>{
          c.removeEventListener("mousemove", handlemousemove)
          c.removeEventListener("mouseup", handlemouseup)
          c.removeEventListener("mousedown", handlemousedown)
         }
      }
      else
      {
        console.log("receieving drawing")
        socket.on("receiving-drawing", (painting_data)=>{
          console.log(`Receiving Drawing ${painting_data}`)
          const painting=painting_data.painting;
          console.log(painting)
          const{x0,y0,x1,y1,color}=painting
          onDrawingEvent({x0,y0,x1,y1,color})
        })
       
      }
     })
  
  
  
    const drawLine = (x0:number, y0:number, x1:number, y1:number, color:string, emit:boolean) => {
      ctx.beginPath()
      ctx.moveTo(x0, y0)
      ctx.lineTo(x1, y1)
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.closePath()
     
      if (!emit) {
        return
      } else {
        const w = c.width
        const h = c.height
   console.log("sending drawing")
        socket.emit("sending-drawing", {
          x0: x0 / w,
          y0: y0 / h,
          x1: x1 / w,
          y1: y1 / h,
          color,
        })
       console.log(socket.connected)
      }
    }
   function onDrawingEvent({x0,y0,x1,y1,color}:{x0:number,y0:number,x1:number,y1:number,color:string}) {
      const w = c.width
      const h = c.height
      console.log(`${x0}  ${y0}  ${x1}   ${y1} `)
      drawLine(
        x0 * w,
        y0 * h,
        x1 * w,
        y1 * h ,
        color,
        false
      )
    }
 
  })
  socket.on("final-score",(data)=>{
    const result=data;
    console.log(result)
  })

}, [socket,letter,painter])

 function checkingword(){
  if(inputRef.current.value===letter){
  scoreTable.push({painter,score})
  socket?.emit("score-result",{scoreTable})
  }
 }
 
  return (
    <div>
      <div>
     
      <canvas
        ref={canvasRef}
        height={window.innerHeight}
        width={window.innerWidth}
      ></canvas>
      {painter!==your_UserId  && <div className="relative">
        <div className="absolute right-10 bottom-10">
        <input ref={inputRef} onChange={checkingword}></input>
        </div>
        </div>}
      </div>
    </div>
  )
}

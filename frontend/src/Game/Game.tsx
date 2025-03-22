import { useEffect, useRef, useState } from "react"
import { useSocket } from "../Hook/Socket"
import { images, your_UserId } from "../Page/Landing_Page";
import { LuPencil } from "react-icons/lu"

export function Game() {
  const [letter, setLetter] = useState()
  const [score, setScore] = useState(0)
  const [room,setRoomId]=useState({});
  const[users,setUsers]=useState([])
  const[painter,setPainter]=useState()
 const[playerrooms,setPlayer]=useState([])

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
      const { roomId,user, word,players } = data
      console.log(` player from socket ${players}`)
      setPlayer(players)  
      console.log(socket.connected)
    console.log(`${data} player joined`)
    setUsers(user)
    setRoomId(roomId)
      setLetter(word)
    })
  console.log(`player joined user array ${users}`)
    socket.on("start-round",(data)=>{
      const {rooms,roomId}=data;
     
      setRoomId(roomId)
      console.log(`started   rounded`+JSON.stringify(rooms))
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
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.closePath()
     
      if (!emit) {
        return
      } else {
        const w = c.width
        const h = c.height
        socket.emit("sending-drawing", {
          x0: x0 / w,
          y0: y0 / h,
          x1: x1 / w,
          y1: y1 / h,
          color,
        })

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

}, [painter])

 function checkingword(){
  if(inputRef.current.value===letter){
  scoreTable.push({painter,score})
  socket?.emit("score-result",{scoreTable})
  }
 }
 
  return (
    <div className="h-screen w-screen overflow-x-hidden overflow-y-hidden relative">
      <div>
          <div className="overflow-hidden justify-items-center border-1 mt-4">
              <canvas
                ref={canvasRef}
                height={600}
                width={1100}
                className="border-2"
              ></canvas>
             </div>
            

             <div className="absolute left-8 top-8 w-36  ">
             {playerrooms.map(({ userId, ws, character }: { userId: string; ws: string; character: number }) => (
                  <div className="relative">
                  <div key={userId} className="flex flex-col items-center grid grid-cols-5 ">
                    <div className="w-14 h-20  mt-2 border-indigo-500 rounded-full flex justify-center items-center overflow-hidden col-span-4">
                      <img className="rounded-3xl" src={images[character] || "/default.png"} alt={`Character ${character}`} />
                    </div>
                    <div className="text-indigo-500 text-base -ml-8 content-center col-span-1 ">
                    {painter &&<LuPencil />}
                      {userId}
                    </div>
                  </div>
                  </div>
                ))}               
            </div> 
      </div>
      <div className="place-items-center absolute left-1/2 bottom-8 h-16"> 
      {painter!==your_UserId  && <div className="relative justify-items-center -mt-4">
        <div className="text-indigo-500"> Enter Word Here</div>
        <div >
        <input className="h-12 mt-2" ref={inputRef} onChange={checkingword}></input>
        </div>
        </div>}
        </div>
    </div>
  )
}

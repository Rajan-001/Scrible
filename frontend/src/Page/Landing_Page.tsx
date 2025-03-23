import { useEffect, useRef, useState } from "react"
import { useSocket } from "../Hook/Socket"
import { useNavigate } from "react-router-dom"
import path_1 from "../assets/Images/Character/Character_1.jpg"
import path_2 from "../assets/Images/Character/Character_2.jpg"
import path_3 from "../assets/Images/Character/Character_3.jpg"
import path_4 from "../assets/Images/Character/Character_4.jpg"
import path_5 from "../assets/Images/Character/Character_5.jpg"
import path_6 from "../assets/Images/Character/Character_6.jpg"
import path_7 from "../assets/Images/Character/Character_7.jpg"
import path_8 from "../assets/Images/Character/Character_8.jpg"
import path_9 from "../assets/Images/Character/Character_9.jpg"
import path_10 from "../assets/Images/Character/Character_10.jpg"
import path_11 from "../assets/Images/Character/Character_11.jpg"
import path_12 from "../assets/Images/Character/Character_12.jpg"
import path_13 from "../assets/Images/Character/Character_13.jpg"
import path_14 from "../assets/Images/Character/Character_14.jpg"
import path_15 from "../assets/Images/Character/Character_15.jpg"

export const images: Record<number, string> = {
  1: path_1,
  2: path_2,
  3: path_3,
  4: path_4,
  5: path_5,
  6: path_6,
  7: path_7,
  8: path_8,
  9: path_9,
  10: path_10,
  11: path_11,
  12: path_12,
  13: path_13,
  14: path_14,
  0: path_15,
};
import { FaCircleLeft, FaCircleRight } from "react-icons/fa6"
export let  your_UserId=""



export const LandingPage = () => {

  const userRef = useRef(null)
  const roomRef = useRef(null)
 const [count,setCount]=useState(7)

  const socket = useSocket()!
  const [username, setUsername] = useState()
  const [room, setRoom] = useState()


  const navigate = useNavigate()
  useEffect(() => {
    console.log(socket)
    if (username && room) {
      your_UserId=username;
      socket.emit("connect room", {
        userId: username,
        roomId: room,
        character:count
      })
      console.log("Connected to Room")
    }
  }, [socket, username, room])

function onSubmit() {
    setUsername(userRef.current.value)
    setRoom(roomRef.current.value)
    navigate("/game")
  }
  return (
    <div className="h-screen w-screen bg-black">
      <div>
  
        <div className="input-container justify-items-center items-center">
          <p className='text-white mt-10'>Select Your Character</p>
          <div className="justify-items-center text-4xl mt-8 text-center content-center place-items-center grid grid-cols-3">
        <div onClick={()=>{setCount(index=>(((index-1)%15)+15)%15)}} className=" text-white"><FaCircleLeft /></div> 
        <div className="w-36 h-36 border-2  rounded-3xl color-white justify-items-center items-center place-content-center overflow-hidden">
          <img src={images[count]}    />
      </div>
      <div onClick={()=>{setCount(index=>(index+1)%15)}} className=" text-white"><FaCircleRight /></div>
      </div>
          <input type="text" placeholder="Username" ref={userRef} />
          <input className="overflow-hidden" type="string" placeholder="Room" ref={roomRef} />
          <button className="button rounded-full" onClick={onSubmit}>
            Join
          </button>
        </div>
      </div>
      <div className="h-screen justify-center justify-items-center  mt-24">
        <div className="pyramid-loader">
          <div className="wrapper">
            <span className="side side1"></span>
            <span className="side side2"></span>
            <span className="side side3"></span>
            <span className="side side4"></span>
            <span className="shadow"></span>
          </div>
        </div>
      </div>
    </div>
  )
}

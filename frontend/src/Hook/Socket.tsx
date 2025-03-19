import { createContext, ReactNode, useContext, useEffect, useRef } from "react"
import { io, Socket } from "socket.io-client"

const SocketContext = createContext<Socket | null>(null)
export const useSocket = () => {
  return useContext(SocketContext)
}

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socket = useRef<Socket | null>(null)
  useEffect(() => {
    socket.current = io("http://localhost:3002")

  }, [])
  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  )
}

import React from "react";
import { motion } from "framer-motion";

const WinningPage = ({ userId, score }:{ userId:string, score:number }) => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-black text-white p-6 overflow-hidden">
      {/* Animated Stars */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white rounded-full"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
          style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
        />
      ))}
      <div className="bg-white text-black p-8 rounded-2xl shadow-lg text-center relative z-10">
        <motion.h1 
          className="text-4xl font-bold mb-4"
          initial={{ scale: 0.8, opacity: 0, y: 0 }}
          animate={{ scale: 1.2, opacity: 1, y: [0, -10, 0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            backgroundImage: "linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            animation: "rainbow 3s linear infinite"
          }}
        >
          🎉 Congratulations! 🎉
        </motion.h1>
        <motion.p 
          className="text-2xl font-semibold mb-2 text-gray-800"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          🏆 Winner: <span className="text-indigo-600 font-bold">{userId}</span>
        </motion.p>
        <motion.p 
          className="text-2xl font-semibold mb-4 text-gray-800"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          🎯 Score: <span className="text-green-600 font-bold">{score}</span>
        </motion.p>
        <button className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition">
          Play Again
        </button>
      </div>
      <style>
        {`
          @keyframes rainbow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </div>
  );
};

export default WinningPage
"use client"

import { useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <div className='container w-1/2 mx-auto mt-5 flex justify-center items-center border rounded border-cyan-100 shadow border-solid'>
      <div className="flex flex-col">
        <div className="flex justify-between bg-slate-50 gap-2">
          <button className="w-1/2 px-4 py-1 rounded-md bg-sky-500 hover:bg-sky-700 hover:text-cyan-50" onClick={() => setIsLogin(true)}>Login</button>
          <button className="w-1/2 px-4 py-1 rounded-md bg-sky-500 hover:bg-sky-700 hover:text-cyan-50" onClick={() => setIsLogin(false)}>Sign up</button>
        </div>
        {
          isLogin ? <Login /> : <Signup />
        }
      </div>
    </div>
  );
}

"use client"
import { useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <div className="flex w-100 h-100 justify-center items-center">
      <div className='container w-1/2 mx-auto mt-5 flex justify-center items-center'>
        <div className="flex flex-col  w-1/2 py-4">
          <div className="flex justify-between bg-slate-50 gap-2">
            <Button 
              className='bg-blue-700 hover:bg-blue-600 w-1/2'
              onClick={() => setIsLogin(true)}
              disabled={isLogin}
              type="button"
              >
                Login
            </Button>
            <Button 
              className='bg-blue-700 hover:bg-blue-600 w-1/2'
              onClick={() => setIsLogin(false)}
              disabled={!isLogin}
              type="button"
              >
                Sign up
            </Button>
          </div>
          {
            isLogin ? <Login /> : <Signup setIsLogin={setIsLogin}/>
          }
        </div>
      </div>
    </div>
  );
}

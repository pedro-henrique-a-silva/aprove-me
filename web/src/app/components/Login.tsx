"use client"
import React, { useEffect, useState } from 'react'
import {  ZodError } from 'zod';
import { loginSchema } from '../schemas/login-schema';
import { connection } from '../utils/api-connection';
import { useRouter } from 'next/navigation';
import { saveTokenToLocalStore } from '../utils/local-store-helper';
import { saveCookie } from '../utils/cookies-helper';


function Login() {
  const [error, setError] = useState<string[] | null>(null);
  const router = useRouter();

  async function handleSubmit (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());


    const {success, error} = loginSchema.safeParse(data);
    if (!success) {
      setError(JSON.parse(error.message).map((e: ZodError) => e.message));
      return;
    }

    try {
      const response = await connection.post('/auth/login', {
        ...data,
      })

      const { token } = response.data;

      saveTokenToLocalStore('token', token);
      await saveCookie(token)

      setTimeout(() => {
        router.push("/payable");
      }, 1500);

    } catch (error: any) {
      if (error.response.status !== 200) {
        setError(['Error on login']);
        return;
      }
    }
  }

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  }, [error])

  return (
    <>
    <form onSubmit={handleSubmit} className='flex flex-col justify-center w-full mt-10'>
        <div className='flex flex-col pb-1'>
          <label htmlFor="">Username</label>
          <input className='border shadow p-1' id='username' name='username' type="text" />
        </div>
        <div className='flex flex-col pb-1'>
          <label htmlFor="">Password</label>
          <input className='border shadow p-1' id='password' name='password' type="password" />
        </div>
        <div className='flex flex-col justify-center pb-1 mt-2 mb-2'>
          <button 
          className="px-4 py-1 rounded-md bg-sky-500 hover:bg-sky-700 hover:text-cyan-50" 
          type="submit">Login</button>
        </div>
    </form>
    {error && (
      <div className='flex flex-col justify-center'>
        {error.map((e, i) => (
          <div key={i} className='text-red-400 bg-red-100 mb-2 p-2 rounded text-center'>{e}</div>
        ))}
      </div>
    )}
    </>
  )
}

export default Login
"use client"
import React, { useState } from 'react'
import { signupSchema } from '../schemas/signup-schema';
import { ZodError } from 'zod';

function Signup() {
  const [error, setError] = useState<string[]>([]);

  async function handleSubmit (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const {success, error} = signupSchema.safeParse(data);
    if (!success) {
      setError(JSON.parse(error.message).map((e: ZodError) => e.message));
      return;
    }
  }


  return (
    <form onSubmit={handleSubmit} className='flex flex-col justify-center mt-10'>
        <div className='flex flex-col pb-1'>
          <label htmlFor="">Nome</label>
          <input className='border shadow' id='nome' name='nome' type="text" />
        </div>
        <div className='flex flex-col pb-1'>
          <label htmlFor="">CPF:</label>
          <input className='border shadow' id='cpf' name='cpf' type="text" />
        </div>
        <div className='flex flex-col pb-1'>
          <label htmlFor="">Email:</label>
          <input className='border shadow' id='email' name='email' type="text" />
        </div>
        <div className='flex flex-col pb-1'>
          <label htmlFor="">Phone:</label>
          <input className='border shadow' id='phone' name='phone' type="text" />
        </div>
        <div className='flex flex-col pb-1'>
          <label htmlFor="">Password</label>
          <input className='border shadow' id='password' name='password' type="password" />
        </div>
        <div className='flex flex-col justify-center pb-1 mt-2 mb-4'>
          <button className="px-4 py-1 rounded-md bg-sky-500 hover:bg-sky-700 hover:text-cyan-50" type="submit">Sign up</button>
        </div>

        {error.length && (
          <div className='flex flex-col justify-center'>
            {error.map((e, i) => (
              <div key={i} className='text-red-400 bg-red-100 mb-2 p-2 rounded text-center'>{e}</div>
            ))}
          </div>
        )}
    </form>
  )
}

export default Signup
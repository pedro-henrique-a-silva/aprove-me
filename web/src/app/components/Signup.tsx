"use client"
import React, { useEffect, useState } from 'react'
import { signupSchema } from '../schemas/signup-schema';
import { ZodError } from 'zod';
import { connection } from '../utils/api-connection';
import { useRouter } from 'next/navigation';

type SignupProps = {
  setIsLogin: (isLogin: boolean) => void;
}

function Signup(props: SignupProps) {
  const {  setIsLogin } = props;
  const [error, setError] = useState<string[] | null>(null);

  async function handleSubmit (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const {success, error} = signupSchema.safeParse(data);
    if (!success) {
      setError(JSON.parse(error.message).map((e: ZodError) => e.message));
      return;
    }

    try {
      await connection.post('/integrations/assignor', {
        ...data,
        name: data.nome,
        document: data.cpf,
      })

      setTimeout(() => {
        setIsLogin(true);
      }, 1500);

    } catch (error: any) {
      if (error.response.status !== 201) {
        setError(['Error creating new assignor']);
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

export default Signup
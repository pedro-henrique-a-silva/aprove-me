"use client"
import React, { useEffect, useState } from 'react'
import {  ZodError } from 'zod';
import { loginSchema } from '../schemas/login-schema';
import { connection } from '../utils/api-connection';
import { useRouter } from 'next/navigation';
import { saveTokenToLocalStore } from '../utils/local-store-helper';
import { saveCookie } from '../utils/cookies-helper';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';


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
    <Card className='mt-4'>
      <CardHeader>
        <div className='flex justify-center w-full'>
          <Image
            src="/logo-bankme.png"
            width={500}
            height={500}
            alt="Logo"
            className='w-1/4'
          />
        </div>
        <CardTitle className='text-center mt-2'>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='flex flex-col justify-center w-full'>
          <div className='flex flex-col pb-1'>
            <Label className='mb-2' htmlFor="username">Username</Label>
            <Input id='username' name='username' type="text" />
          </div>
          <div className='flex flex-col pb-1'>
            <Label className='mb-2' htmlFor="password">Password</Label>
            <Input id='password' name='password' type="password" />
          </div>
          <div className='flex flex-col justify-center pb-1 mt-2 mb-2'>
            <Button className='bg-blue-700 hover:bg-blue-600' type="submit">Login</Button>
          </div>
      </form>
      </CardContent>
      <CardFooter>
        {error && (
        <div className='flex flex-col justify-center'>
          {error.map((e, i) => (
            <div key={i} className='text-red-400 bg-red-100 mb-2 p-2 rounded text-center'>{e}</div>
          ))}
        </div>
      )}
      </CardFooter>
    </Card>
    
    
    </>
  )
}

export default Login
"use client"
import React, { use, useEffect, useState } from 'react'
import { connection } from '../utils/api-connection';
import { getTokenFromLocalStore } from '../utils/local-store-helper';
import { ZodError } from 'zod';
import { useParams, useRouter } from 'next/navigation';
import { registerAssignorSchema } from '../schemas/create-assignor';
import { Assignor } from '../types/assignor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

type CreateAssignorProps = {
  isEditing?: boolean;
}

function CreateAssignor(props: CreateAssignorProps) {
  const { isEditing } = props;
  const router = useRouter();
  const [error, setError] = useState<string[] | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    document: '',
    phone: '',
  });
  const params = useParams();
  const { id } = params;

  async function handleSubmit (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const {success, error} = registerAssignorSchema.safeParse(data);
    if (!success) {
      setError(JSON.parse(error.message).map((e: ZodError) => e.message));
      return;
    }

    const token = getTokenFromLocalStore('token');

    try {
      const url = isEditing ? `/integrations/assignor/${id}` : '/integrations/assignor'
      const axioMethod = isEditing ? connection.put : connection.post;

      const response = await axioMethod(url, {
        ...data,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      },
    )

      setTimeout(() => {
        router.push(`/assignor/${response.data.id}`);
      }, 1000);

    } catch (error: any) {
      if (error.response.status !== 201) {
        setError(['Erro ao criar recebível']);
        return;
      }
    }
    
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  }, [error])

  useEffect(() => {
    async function data() {
      const token = getTokenFromLocalStore('token');
      const assignorsResponse = await connection.get<Assignor>(`/integrations/assignor/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFormData({
        name: assignorsResponse.data.name,
        email: assignorsResponse.data.email,
        document: assignorsResponse.data.document,
        phone: assignorsResponse.data.phone,
      });
    }
    

    if (isEditing) {
      data();
    }
  }, [isEditing])


  return (
    <>
    <Card className='mt-4'>
      <CardHeader>
        <CardTitle className='text-center mt-2'>{id ? "Editar Cedente" : "Registras Cedente"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='flex flex-col justify-center w-full gap-4'>
          <div className='flex flex-col pb-1'>
            <Label className='mb-2' htmlFor="username">Nome:</Label>
            <Input 
              onChange={(e) => handleInputChange(e)}
              placeholder='Nome'
              id='name' 
              name='name'
              value={formData.name}
              type="text" /> 
          </div>
          <div className='flex flex-col pb-1'>
            <Label className='mb-2' htmlFor="username">CPF:</Label>
            <Input 
              onChange={(e) => handleInputChange(e)}
              placeholder='00000000000'
              className='border shadow p-1' 
              id='document' 
              name='document'
              value={formData.document}
              type="text" />
          </div>

          <div className='flex flex-col pb-1'>
            <Label className='mb-2' htmlFor="username">E-mail:</Label>
            <Input 
              onChange={(e) => handleInputChange(e)}
              placeholder='email@email.com'
              className='border shadow p-1' 
              id='email' 
              name='email' 
              value={formData.email}
              type="text" />
          </div>
          <div className='flex flex-col pb-1'>
            <Label className='mb-2' htmlFor="username">Telefone:</Label>
            <Input 
               onChange={(e) => handleInputChange(e)}
               placeholder='99 99999 9999'
               className='border shadow p-1' 
               id='phone' 
               name='phone' 
               value={formData.phone}
               type="text" />
             
          </div>
       
        <div className='flex flex-col justify-center pb-1 mt-2 mb-2'>
          <Button className='bg-blue-700 hover:bg-blue-600' type="submit">Registrar Cedente</Button>
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

export default CreateAssignor
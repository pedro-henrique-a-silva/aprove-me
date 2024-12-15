"use client"
import React, { use, useEffect, useState } from 'react'
import { connection } from '../utils/api-connection';
import { getTokenFromLocalStore } from '../utils/local-store-helper';
import { ZodError } from 'zod';
import { useParams, useRouter } from 'next/navigation';
import { registerAssignorSchema } from '../schemas/create-assignor';
import { Assignor } from '../types/assignor';

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
    <form onSubmit={handleSubmit} className='flex flex-col justify-center w-full mt-10 gap-4'>
        <div className='flex flex-col pb-1'>
          <label htmlFor="">Nome:</label>
          <input
            onChange={(e) => handleInputChange(e)}
            placeholder='100.00'
            className='border shadow p-1' 
            id='name' 
            name='name'
            value={formData.name}
            type="text" />
        </div>
        <div className='flex flex-col pb-1'>
          <label htmlFor="">CPF:</label>
          <input
            onChange={(e) => handleInputChange(e)}
            placeholder='00000000000'
            className='border shadow p-1' 
            id='document' 
            name='document'
            value={formData.document}
            type="text" />
        </div>
        <div className='flex flex-col pb-1'>
          <label htmlFor="">E-mail:</label>
          <input
            onChange={(e) => handleInputChange(e)}
            placeholder='email@email.com'
            className='border shadow p-1' 
            id='email' 
            name='email' 
            value={formData.email}
            type="text" />
        </div>
        <div className='flex flex-col pb-1'>
          <label htmlFor="">E-mail:</label>
          <input
            onChange={(e) => handleInputChange(e)}
            placeholder='00000000000'
            className='border shadow p-1' 
            id='phone' 
            name='phone' 
            value={formData.phone}
            type="text" />
        </div>

        
        <div className='flex flex-col justify-center pb-1 mt-2 mb-4'>
          <button 
            className="px-4 py-1 rounded-md bg-sky-500 hover:bg-sky-700 hover:text-cyan-50" 
            type="submit">
              Registrar Cedente
          </button>
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

export default CreateAssignor
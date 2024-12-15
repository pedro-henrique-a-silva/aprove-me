"use client"
import React, { useEffect, useState } from 'react'
import { connection } from '../utils/api-connection';
import { Assignor } from '../types/assignor';
import { getTokenFromLocalStore } from '../utils/local-store-helper';
import { createPayableSchema } from '../schemas/create-payable';
import { ZodError } from 'zod';
import { formatDate, formatDateToApiFormat } from '../utils/date-helper';
import { useParams, useRouter } from 'next/navigation';
import { Payable } from '../types/payable';

type CreatePayableProps = {
  isEditing?: boolean;
}

function CreatePayable(props: CreatePayableProps) {
  const { isEditing } = props;
  const [assignor, setAssignors] = useState<Assignor[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [error, setError] = useState<string[] | null>(null);
  const [formData, setFormData] = useState({
    value: '',
    emissionDate: '',
  });

  const params = useParams();
  const { id } = params;

  const router = useRouter();

  async function handleSubmit (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const {success, error} = createPayableSchema.safeParse(data);
    if (!success) {
      setError(JSON.parse(error.message).map((e: ZodError) => e.message));
      return;
    }

    const token = getTokenFromLocalStore('token');

    try {
      const url = isEditing ? `/integrations/payable/${id}` : '/integrations/payable'
      const axioMethod = isEditing ? connection.put : connection.post;
      console.log(formatDateToApiFormat(data.emissionDate as string))
      const response = await axioMethod(url, {
          emissionDate: formatDateToApiFormat(data.emissionDate as string),
          value: data.value,
          assignorId: selectedOption,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      },
    )

      setTimeout(() => {
        router.push(`/payable/${response.data.id}`);
      }, 1000);

    } catch (error: any) {
      if (error.response.status !== 201) {
        setError(['Erro ao criar recebível']);
        return;
      }
    }
    
  }

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

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
      const assignorsResponse = await connection.get<Assignor[]>("/integrations/assignor", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAssignors(assignorsResponse.data);
    }
    data();
  }, []);

  useEffect(() => {
    async function data() {
      const token = getTokenFromLocalStore('token');
      const payableResponse = await connection.get<Payable>(`/integrations/payable/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(payableResponse.data)
      setFormData({
        value: payableResponse.data.value,
        emissionDate: formatDateToApiFormat(payableResponse.data.emissionDate),
      })
      setSelectedOption(payableResponse.data.assignorId);
    }
    data();
  }, []);

  return (
    <>
    <form onSubmit={handleSubmit} className='flex flex-col justify-center w-full mt-10 gap-4'>
        <div className='flex flex-col pb-1'>
          <label htmlFor="">Valor</label>
          <input
            placeholder='100.00'
            onChange={(e) => handleInputChange(e)}
            className='border shadow p-1' 
            id='value' 
            name='value' 
            value={formData.value}
            type="text" />
            
        </div>
        <div className='flex flex-col pb-1'>
          <label htmlFor="">Data da emissão:</label>
          <input
            onChange={(e) => handleInputChange(e)}
            placeholder='31/12/2024'
            className='border shadow p-1' 
            id='emissionDate' 
            name='emissionDate'
            value={formData.emissionDate}
            type="date" />
        </div>

        <div className='flex flex-col pb-1'>
          <label htmlFor="assignors">Cedente:</label>
          <select
            id="assignors"
            name="assignors"
            value={selectedOption || ''}
            onChange={handleChange}
            className="border px-2 py-1 rounded p-1" 
          >
            <option value="" disabled>
              Selecione uma opção
            </option>
            {assignor.map((assignor) => (
              <option key={assignor.id} value={assignor.id}>
                {assignor.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className='flex flex-col justify-center pb-1 mt-2 mb-4'>
          <button 
            className="px-4 py-1 rounded-md bg-sky-500 hover:bg-sky-700 hover:text-cyan-50" 
            type="submit">
              Registrar Recebível
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

export default CreatePayable
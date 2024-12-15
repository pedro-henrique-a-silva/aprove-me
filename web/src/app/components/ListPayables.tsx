"use client"
import React, { useEffect, useState } from 'react'
import { getTokenFromLocalStore } from '../utils/local-store-helper';
import { connection } from '../utils/api-connection';
import { Payable } from '../types/payable';
import { formatDate } from '../utils/date-helper';
import { useRouter } from 'next/navigation';

function ListPayables() {
  const [payables, setPayable] = useState<Payable[]>([]);

  const router = useRouter();

  const handleDetailsButtonClick = (id: string) => {
    router.push(`/payable/${id}`);
  }

  const handleEditButtonClick = (id: string) => {
    router.push(`/payable/${id}/edit`);
  }

  const handleDeleteButtonClick = async (id: string) => {
    const token = getTokenFromLocalStore('token');
    try {
      await connection.delete<Payable[]>(`/integrations/payable/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPayable(payables.filter((payable) => payable.id !== id));

    } catch (error: any) {
      if (error.response.status !== 200) {
        alert('Error on delete');
        return;
      }
    }
  }

  useEffect(() => {
    async function data() {
      const token = getTokenFromLocalStore('token');
      const payableResponse = await connection.get<Payable[]>("/integrations/payable", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPayable(payableResponse.data);
    }
    data();
  }, []);

  return (
    <table>
      <thead>
        <tr className='text-center'>
          <th className='text-center'>Id</th>
          <th className='text-center'>Value</th>
          <th className='text-center'>Emission Date</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {payables.map((payable) => (
          <tr key={payable.id}>
            <td className='text-center px-4'>{payable.id}</td>
            <td className='text-center px-4'>{payable.value}</td>
            <td className='text-center px-4'>{formatDate(payable.emissionDate)}</td>
            <td className='flex justify-center items-center gap-2 text-center px-4'>
              <button
                onClick={() => handleDetailsButtonClick(payable.id)}
                className="px-4 py-1 rounded-md bg-sky-500 hover:bg-sky-700 hover:text-cyan-50" 
              >
                Detalhes
              </button>
              <button
                onClick={() => handleEditButtonClick(payable.id)}
                className="px-4 py-1 rounded-md bg-sky-500 hover:bg-sky-700 hover:text-cyan-50" 
              >
                Editar
              </button>
              <button
                onClick={() => handleDeleteButtonClick(payable.id)}
                className="px-4 py-1 font-semibold rounded-md bg-red-300 hover:bg-red-400 hover:text-cyan-50" 
              >
                X
              </button>
            </td>
          </tr>
        ))}
      </tbody>
      
    </table>
  )
}

export default ListPayables
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

  useEffect(() => {
    async function data() {
      const token = getTokenFromLocalStore('token');
      const assignorsResponse = await connection.get<Payable[]>("/integrations/payable", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPayable(assignorsResponse.data);
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
            <td className='text-center px-4'>
              <button
                onClick={() => handleDetailsButtonClick(payable.id)}
                className="px-4 py-1 rounded-md bg-sky-500 hover:bg-sky-700 hover:text-cyan-50" 
              >
                Detalhes
              </button>
            </td>
          </tr>
        ))}
      </tbody>
      
    </table>
  )
}

export default ListPayables
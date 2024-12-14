"use client"
import React, { useEffect, useState } from 'react'
import { getTokenFromLocalStore } from '../utils/local-store-helper';
import { connection } from '../utils/api-connection';
import { useRouter } from 'next/navigation';
import { Assignor } from '../types/assignor';

function ListAssignor() {
  const [assignor, setAssignor] = useState<Assignor[]>([]);

  const router = useRouter();

  const handleDetailsButtonClick = (id: string) => {
    router.push(`/assignor/${id}`);
  }

  const handleDeleteButtonClick = async (id: string) => {
    const token = getTokenFromLocalStore('token');
    try {
      await connection.delete<Assignor>(`/integrations/assignor/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAssignor(assignor.filter((a) => a.id !== id));

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
      const assignorsResponse = await connection.get<Assignor[]>("/integrations/assignor", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAssignor(assignorsResponse.data);
    }
    data();
  }, []);

  return (
    <table>
      <thead>
        <tr className='text-center'>
          <th className='text-center'>Id</th>
          <th className='text-center'>Nome</th>
          <th className='text-center'>CPF</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {assignor.map((assignor) => (
          <tr key={assignor.id}>
            <td className='text-center px-4'>{assignor.id}</td>
            <td className='text-center px-4'>{assignor.name}</td>
            <td className='text-center px-4'>{assignor.document}</td>
            <td className='flex justify-center items-center gap-2 text-center px-4'>
              <button
                onClick={() => handleDetailsButtonClick(assignor.id)}
                className="px-4 py-1 rounded-md bg-sky-500 hover:bg-sky-700 hover:text-cyan-50" 
              >
                Detalhes
              </button>
              <button
                onClick={() => handleDeleteButtonClick(assignor.id)}
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

export default ListAssignor
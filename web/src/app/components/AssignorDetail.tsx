"use client"
import React, { useEffect, useState } from 'react'
import { getTokenFromLocalStore } from '../utils/local-store-helper';
import { connection } from '../utils/api-connection';
import { useParams } from 'next/navigation';
import { Assignor } from '../types/assignor';


function AssignorDetail() {
  const [assignor, setAssignor] = useState<Assignor | null>(null);
  const params = useParams();
  const { id } = params;
  useEffect(() => {
    async function data() {
      const token = getTokenFromLocalStore('token');
      const assignorsResponse = await connection.get<Assignor>(`/integrations/assignor/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAssignor(assignorsResponse.data);
    }
    data();
  }, []);
  return (
    <div className='flex flex-col justify-center items-center p-6 gap-6 mt-6 border-1 shadow rounded-xl shadow-black border-slate-300'>
      <div>
        <h1 className='text-black font-semibold'>Cedente</h1>
        {assignor && (
          <div>
            <p>Id: {assignor.id}</p>
            <p>Nome: {assignor.name}</p>
            <p>Email: {assignor.email}</p>
            <p>CPF: {assignor.document}</p>
            <p>Telefone: {assignor.phone}</p>
          </div>
        )}
      </div>


    </div>
  )
}

export default AssignorDetail
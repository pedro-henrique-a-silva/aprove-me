"use client"

import React, { useEffect, useState } from 'react'
import { getTokenFromLocalStore } from '../utils/local-store-helper';
import { connection } from '../utils/api-connection';
import { Payable } from '../types/payable';
import { useParams } from 'next/navigation';
import { Assignor } from '../types/assignor';
import { formatDate } from '../utils/date-helper';


function PayableDetail() {
  const [payable, setPayable] = useState<Payable | null>(null);
  const [assignor, setAssignor] = useState<Assignor | null>(null);
  const params = useParams();
  const { id } = params;
  useEffect(() => {
    async function data() {
      const token = getTokenFromLocalStore('token');
      const payableResponse = await connection.get<Payable>(`/integrations/payable/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const assignorId = payableResponse.data.assignorId;
      
      const assignorsResponse = await connection.get<Assignor>(`/integrations/assignor/${assignorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPayable(payableResponse.data);
      setAssignor(assignorsResponse.data);
    }
    data();
  }, []);
  return (
    <div className='flex flex-col justify-center items-center p-6 gap-6 mt-6 border-1 shadow rounded-xl shadow-black border-slate-300'>
     <div>
     <h1 className='text-black font-semibold'>Detalhes do Recebivel</h1>
      {payable && (
        <div>
          <p>Id: {payable.id}</p>
          <p>Value: {payable.value}</p>
          <p>Emission Date: {formatDate(payable.emissionDate)}</p>
        </div>
      )}
     </div>

      <div>
        <h3 className='text-black font-semibold'>Cedente</h3>
        {assignor && (
          <div>
            <p>Id: {assignor.id}</p>
            <p>Nome: {assignor.name}</p>
            <p>Email: {assignor.email}</p>
            <p>CPF: {assignor.document}</p>
          </div>
        )}
      </div>


    </div>
  )
}

export default PayableDetail
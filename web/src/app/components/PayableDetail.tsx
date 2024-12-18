"use client"

import React, { useEffect, useState } from 'react'
import { getTokenFromLocalStore } from '../utils/local-store-helper';
import { connection } from '../utils/api-connection';
import { Payable } from '../types/payable';
import { useParams } from 'next/navigation';
import { Assignor } from '../types/assignor';
import { formatDate } from '../utils/date-helper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';


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
   
      <Card className='mt-4 w-2/5 mx-auto'>
      <CardHeader>
        <CardTitle className='text-center mt-2'>Detalhes do Recebível</CardTitle>
      </CardHeader>
      <CardContent>
      {payable && (
        <div>
          <p>Id: {payable.id}</p>
          <p>Value: {payable.value}</p>
          <p>Emission Date: {formatDate(payable.emissionDate)}</p>
        </div>
      )}
     
      </CardContent>

      <Separator />

      <CardHeader>
        <CardTitle className='text-center mt-2'>Detalhes do Cedente</CardTitle>
      </CardHeader>
      <CardContent>
        {assignor && (
          <div>
            <p>Id: {assignor.id}</p>
            <p>Nome: {assignor.name}</p>
            <p>Email: {assignor.email}</p>
            <p>CPF: {assignor.document}</p>
            <p>Telefone: {assignor.phone}</p>
          </div>
        )}
     
      </CardContent>
    </Card>

  )
}

export default PayableDetail
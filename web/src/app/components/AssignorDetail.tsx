"use client"
import React, { useEffect, useState } from 'react'
import { getTokenFromLocalStore } from '../utils/local-store-helper';
import { connection } from '../utils/api-connection';
import { useParams } from 'next/navigation';
import { Assignor } from '../types/assignor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


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
    <Card className='mt-4 w-2/5 mx-auto'>
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

export default AssignorDetail
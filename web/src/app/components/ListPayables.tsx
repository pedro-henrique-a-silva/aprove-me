"use client"
import React, { useEffect, useState } from 'react'
import { getTokenFromLocalStore } from '../utils/local-store-helper';
import { connection } from '../utils/api-connection';
import { Payable } from '../types/payable';
import { formatDate } from '../utils/date-helper';
import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { formatBRL } from '../utils/format-money';

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
    <>
    <Table className='w-4/5 mx-auto'>
    <TableCaption>Lista de Recebíveis.</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead className="w-[400px]">ID</TableHead>
        <TableHead>Value</TableHead>
        <TableHead className="w-[200px]">Emission Date</TableHead>
        <TableHead className="w-[350px] text-right"></TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {payables.map((payable) => (
        <TableRow key={payable.id}>
          <TableCell className="font-medium">{payable.id}</TableCell>
          <TableCell>{formatBRL(Number(payable.value))}</TableCell>
          <TableCell>{formatDate(payable.emissionDate)}</TableCell>
          <TableCell className="text-right flex gap-2">
              <Button 
                onClick={() => handleDetailsButtonClick(payable.id)}
                className='bg-blue-700 hover:bg-blue-600'
              >
                Detalhes
              </Button>
              <Button 
                onClick={() => handleEditButtonClick(payable.id)}
                className='bg-blue-700 hover:bg-blue-600'
              >
                Editar
              </Button>
              <Button 
                onClick={() => handleDeleteButtonClick(payable.id)}
                variant='destructive'
              >
                X
              </Button>
          </TableCell>
          
        </TableRow>
          ))}
      
    </TableBody>
  </Table>
  
    </>
  )
}

export default ListPayables
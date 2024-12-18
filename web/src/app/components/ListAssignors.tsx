"use client"
import React, { useEffect, useState } from 'react'
import { getTokenFromLocalStore } from '../utils/local-store-helper';
import { connection } from '../utils/api-connection';
import { useRouter } from 'next/navigation';
import { Assignor } from '../types/assignor';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

function ListAssignor() {
  const [assignor, setAssignor] = useState<Assignor[]>([]);

  const router = useRouter();

  const handleDetailsButtonClick = (id: string) => {
    router.push(`/assignor/${id}`);
  }

  const handleEditButtonClick = (id: string) => {
    router.push(`/assignor/${id}/edit`);
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
    <>
    <Table className='w-3/5 mx-auto'>
      <TableCaption>Lista de Cedentes.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[400px]">ID</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead className="w-[200px]">CPF</TableHead>
          <TableHead className="w-[350px] text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assignor.map((a) => (
          <TableRow key={a.id}>
            <TableCell className="font-medium">{a.id}</TableCell>
            <TableCell>{a.name}</TableCell>
            <TableCell>{a.document}</TableCell>
            <TableCell className="text-right flex gap-2">
                <Button 
                  onClick={() => handleDetailsButtonClick(a.id)}
                  className='bg-blue-700 hover:bg-blue-600'
                >
                  Detalhes
                </Button>
                <Button 
                  onClick={() => handleEditButtonClick(a.id)}
                  className='bg-blue-700 hover:bg-blue-600'
                >
                  Editar
                </Button>
                <Button 
                  onClick={() => handleDeleteButtonClick(a.id)}
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

export default ListAssignor
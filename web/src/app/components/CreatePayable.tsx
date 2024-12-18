"use client"
import React, { useEffect, useState } from 'react'
import { connection } from '../utils/api-connection';
import { Assignor } from '../types/assignor';
import { getTokenFromLocalStore } from '../utils/local-store-helper';
import { createPayableSchema } from '../schemas/create-payable';
import { ZodError } from 'zod';
import { formatDate, formatDateToApiFormat } from '../utils/date-helper';
import { cn } from "@/lib/utils"
import { useParams, useRouter } from 'next/navigation';
import { Payable } from '../types/payable';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

  const handleChange = (event: string) => {
    setSelectedOption(event);
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
 
      try {
        const payableResponse = await connection.get<Payable>(`/integrations/payable/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        setFormData({
          value: payableResponse.data.value,
          emissionDate: formatDateToApiFormat(payableResponse.data.emissionDate),
        })
        setSelectedOption(payableResponse.data.assignorId);

      } catch {
        console.log('criar o recebível')
      }
    }
    data();
  }, []);

  return (
    <>
    <Card className='mt-4'>
      <CardHeader>
        <CardTitle className='text-center mt-2'>{id ? "Editar Recebível" : "Registras Recebível"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='flex flex-col justify-center w-full gap-4'>
          <div className='flex flex-col pb-1'>
            <Label className='mb-2' htmlFor="username">Valor:</Label>
            <Input 
              placeholder='100.00'
              onChange={(e) => handleInputChange(e)}
              className='border shadow p-1' 
              id='value' 
              name='value' 
              value={formData.value}
              type="text"  
            />
        </div>
        <div className='flex flex-col pb-1'>
            <Label className='mb-2' htmlFor="username">Data da emissão:</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !formData.emissionDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon />
                  {formData.emissionDate ? formatDate(formData.emissionDate) : <span>Data de emissão</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.emissionDate}
                  onSelect={(e: Date) => setFormData((prev) => ({...prev, emissionDate: formatDateToApiFormat(e.toUTCString())}))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
        </div>
        <div className='flex flex-col pb-1'>
          <Label className='mb-2' htmlFor="username">Cedente:</Label>
          <Select
            id="assignors"
            name="assignors"
            value={selectedOption || ''}
            onValueChange={handleChange}
            defaultValue={selectedOption || 'Selecione um Cedente'}
          >
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder={selectedOption || 'Selecione um Cedente'} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup >
                {assignor.map((assignor) => (
                    <SelectItem key={assignor.id} value={assignor.id}>{assignor.name}</SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
        </Select>
        </div>

          <div className='flex flex-col justify-center pb-1 mt-2 mb-2'>
            <Button className='bg-blue-700 hover:bg-blue-600' type="submit">Registrar Recebível</Button>
          </div>
      </form>
        
      </CardContent>
      <CardFooter>
        {error && (
        <div className='flex flex-col justify-center'>
          {error.map((e, i) => (
            <div key={i} className='text-red-400 bg-red-100 mb-2 p-2 rounded text-center'>{e}</div>
          ))}
        </div>
      )}
      </CardFooter>
    </Card>
   
    </>
  )
}

export default CreatePayable
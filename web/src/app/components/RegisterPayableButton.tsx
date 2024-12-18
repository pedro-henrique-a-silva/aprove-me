"use client"
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React from 'react'

function RegisterPayableButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/payable/create');
  }
  return (
    <Button 
      onClick={handleClick}
      className='bg-blue-700 hover:bg-blue-600 w-1/5 mb-6'
    >
      Registrar Recebível
    </Button>
  )
}

export default RegisterPayableButton
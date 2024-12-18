"use client"
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React from 'react'

function RegisterCedenteButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/assignor/create');
  }
  return (
  
    <Button 
      onClick={handleClick}
      className='bg-blue-700 hover:bg-blue-600 w-1/5 mb-6'
    >
      Registrar Cedente
    </Button>
  )
}

export default RegisterCedenteButton
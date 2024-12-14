"use client"
import { useRouter } from 'next/navigation';
import React from 'react'

function RegisterCedenteButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/assignor/create');
  }
  return (
    <button
      onClick={handleClick}
      className="px-4 py-1 w-1/2 mb-6 rounded-md bg-sky-500 hover:bg-sky-700 hover:text-cyan-50" 
    >
          Registrar Cedente
    </button>
  )
}

export default RegisterCedenteButton
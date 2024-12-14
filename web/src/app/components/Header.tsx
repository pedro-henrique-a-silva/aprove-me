import Link from 'next/link'
import React from 'react'

function Header() {
  return (
    <div className='mx-auto flex justify-between bg-gray-400 p-6'>
      <h1>Logo</h1>
      <div className='flex justify-center items-center gap-2'>
        <Link href={'/'}>Home</Link>
        <Link href={'/payable'}>Recebiveis</Link>
        <Link href={'/assignor'}>Cedente</Link>

      </div>
    </div>
  )
}

export default Header
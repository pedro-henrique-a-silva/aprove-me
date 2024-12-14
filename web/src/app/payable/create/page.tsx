import CreatePayable from '@/app/components/CreatePayable'
import React from 'react'

function page() {
  return (
    <div className='container w-1/2 mx-auto mt-5 flex justify-center items-center border rounded border-cyan-100 shadow border-solid'>
      <div className="flex flex-col  w-1/2">
        <CreatePayable/>
      </div>
    </div>
  )
}

export default page
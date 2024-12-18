import CreateAssignor from '@/app/components/CreateAssignor'
import React from 'react'

function page() {
  return (
    <div className='container w-1/2 mx-auto mt-5 flex justify-center items-center'>
      <div className="flex flex-col  w-1/2">
        <CreateAssignor isEditing={false}/>
      </div>
    </div>
  )
}

export default page
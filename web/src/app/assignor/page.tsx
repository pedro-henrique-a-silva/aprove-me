import React from 'react'
import ListAssignor from '../components/ListAssignors'
import RegisterCedenteButton from '../components/RegisterAssignorButton'

function page() {
  return (
    <div className='p-6 flex justify-center items-center flex-col'>
      <RegisterCedenteButton/>
      <ListAssignor />
    </div>
  )
}

export default page
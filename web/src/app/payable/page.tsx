import React from 'react'
import ListPayables from '../components/ListPayables'
import RegisterPayableButton from '../components/RegisterPayableButton'

function page() {
  return (
    <>
      <div className='p-6 flex justify-center items-center flex-col'>
        <RegisterPayableButton />
        <ListPayables/>
    </div>
    </>
  )
}

export default page
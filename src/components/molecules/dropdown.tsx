import { useState, type ReactNode } from 'react'

interface Props {
 body: ReactNode
 trigger: ReactNode
 cb?: () => void
}

export default function Dropdown({ body, trigger, cb }: Props) {
 const [isOpen, setIsOpen] = useState(false)

 const toggle = () => {
  setIsOpen((prev) => !prev)
  cb?.()
 }

 return (
  <div className='relative flex flex-col items-center'>
   <button
    type='button'
    aria-expanded={isOpen}
    onClick={toggle}
    className='text-light'
   >
    {trigger}
   </button>
   {isOpen ? (
    <div className='absolute right-0 top-full mt-3 min-w-36 bg-light p-3 text-dark shadow-lg dark:bg-dark dark:text-light'>
     {body}
    </div>
   ) : null}
  </div>
 )
}

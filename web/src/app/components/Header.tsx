import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@radix-ui/react-navigation-menu'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'


function Header() {
  return (
    <div className='mx-auto flex justify-between items-center bg-white p-2 shadow-sm shadow-slate-100 px-8'>
        <Image
          src="/logo-bankme.png"
          width={50}
          height={40}
          alt="Logo"
        />
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href={'/'}>
              <Button variant="link">
                Home
              </Button>
            </Link>
            <Link href={'/payable'}>
              <Button variant="link">
                  Recebíveis
              </Button>
            </Link>
            <Link href={'/assignor'}>
              <Button variant="link">
                  Cedente
              </Button>
            </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
    </div>
  )
}

export default Header
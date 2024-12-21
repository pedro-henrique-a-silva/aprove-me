'use client'
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@radix-ui/react-navigation-menu'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { deleteCookie } from '../utils/cookies-helper'
import { useRouter } from 'next/navigation'


function Header() {

  const router = useRouter();
  const logout = async () => {
    await deleteCookie()
    localStorage.removeItem('token');

    setTimeout(() => {
      router.push(`/`);
    }, 1000);
  }

  return (
    <header className='w-screen flex justify-between items-center bg-white p-2 shadow-sm shadow-slate-100 px-8'>
        <Image
          src="/logo-bankme.png"
          width={50}
          height={40}
          alt="Logo"
        />
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            
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
              <Button onClick={logout} variant="link">
                Logout
              </Button>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
    </header>
  )
}

export default Header
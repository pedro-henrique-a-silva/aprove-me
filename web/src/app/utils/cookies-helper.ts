'use server'
import { cookies } from 'next/headers'
export async function saveCookie(data: string) {
  const cookieStore = await cookies()
  cookieStore.set('token', data, {
    maxAge: 60 * 60 * 24, 
    httpOnly: true, 
  });
}

export async function deleteCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('token');
}
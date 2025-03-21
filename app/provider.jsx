"use client"

import React, { useEffect, useState } from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import Header from '@/components/custom/Header'
import { MessagesContext } from '@/context/MessagesContext'
import { UserDetailContext } from '@/context/UserDetailContext'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { useConvex } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { SidebarProvider } from '@/components/ui/sidebar'
import AppSideBar from '@/components/custom/AppSideBar'
import { ActionContext } from '@/context/ActionContext'
import { useRouter } from 'next/navigation'

function Provider({ children }) {
  const [messages, setMessages] = useState()
  const [userDetail, setUserDetail] = useState()
  const [action, setAction] = useState()
  const convex = useConvex()
  const router = useRouter()

  useEffect(() => {
    IsAuthenticated()
  }, [])

  const IsAuthenticated = async () => {
    if (typeof window !== undefined) {
      const user = JSON.parse(localStorage.getItem('user'))
      if (!user) {
        router.push('/')
        return;
      }
      const result = await convex.query(api.users.GetUser, { email: user?.email })
      setUserDetail(result)
    }
  }
  return (
    <div>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID_KEY}>
        <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
          <MessagesContext.Provider value={{ messages, setMessages }}>
            <ActionContext.Provider value={{ action, setAction }}>
              <NextThemesProvider
                attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange
              >
                <Header />
                <SidebarProvider defaultOpen={false} >
                  <AppSideBar />
                  {children}
                </SidebarProvider>
              </NextThemesProvider>
            </ActionContext.Provider>
          </MessagesContext.Provider>
        </UserDetailContext.Provider>
      </GoogleOAuthProvider>
    </div>
  )
}

export default Provider

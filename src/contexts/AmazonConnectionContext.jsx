'use client'

// React Imports
import { createContext, useContext, useState, useEffect, useRef } from 'react'

// Supabase Imports
import { supabase } from '@/utils/supabase/client'

// Create Context
const AmazonConnectionContext = createContext()

export const AmazonConnectionProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false)
  const [user, setUser] = useState(null)
  const [userId, setUserId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const isFetched = useRef(false)

  const checkConnection = async (force = false) => {
    // If not forcing a recheck and we already fetched it this session, don't show loading again
    if (!force && isFetched.current) {
      return
    }

    setIsLoading(true)

    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      setIsConnected(false)
      setUser(null)
      setUserId(null)
      setIsLoading(false)
      isFetched.current = true

      return
    }

    setUser(user)
    setUserId(user.id)

    // Check if user has an amazon account linked
    const { data } = await supabase.from('amazon_accounts').select('id').eq('user_id', user.id).limit(1)

    if (data && data.length > 0) {
      setIsConnected(true)
    } else {
      setIsConnected(false)
    }

    setIsLoading(false)
    isFetched.current = true
  }

  useEffect(() => {
    checkConnection()

    // Optionally set up a realtime listener if needed during auth flow
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(event => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        checkConnection(true)
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  return (
    <AmazonConnectionContext.Provider value={{ isConnected, user, userId, isLoading, checkConnection }}>
      {children}
    </AmazonConnectionContext.Provider>
  )
}

export const useAmazonConnection = () => {
  const context = useContext(AmazonConnectionContext)

  if (context === undefined) {
    throw new Error('useAmazonConnection must be used within an AmazonConnectionProvider')
  }

  return context
}

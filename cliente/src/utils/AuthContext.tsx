"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"

interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  role: string
  photo_path?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (userData: any) => Promise<boolean>
  updateProfile: (userData: any) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      fetchProfile()
    }
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/profile`)
      setUser(response.data)
      setIsAuthenticated(true)
    } catch (error) {
      localStorage.removeItem("token")
      delete axios.defaults.headers.common["Authorization"]
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        email,
        password,
      })

      const { access_token, user: userData } = response.data
      localStorage.setItem("token", access_token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`

      setUser(userData)
      setIsAuthenticated(true)
      return true
    } catch (error) {
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    delete axios.defaults.headers.common["Authorization"]
    setUser(null)
    setIsAuthenticated(false)
  }

  const register = async (userData: any): Promise<boolean> => {
    try {
      const formData = new FormData()
      Object.keys(userData).forEach((key) => {
        formData.append(key, userData[key])
      })

      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return true
    } catch (error) {
      return false
    }
  }

  const updateProfile = async (userData: any): Promise<boolean> => {
    try {
      const formData = new FormData()
      Object.keys(userData).forEach((key) => {
        if (userData[key] !== undefined && userData[key] !== null) {
          formData.append(key, userData[key])
        }
      })

      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/profile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      setUser(response.data)
      return true
    } catch (error) {
      return false
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        register,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

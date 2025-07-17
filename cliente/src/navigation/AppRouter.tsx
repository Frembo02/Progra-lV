"use client"

import type React from "react"

import { Routes, Route, Navigate } from "react-router-dom"
import Navbar from "@/components/organisms/Navbar"
import Home from "@/screens/Home"
import Login from "@/screens/Login"
import Register from "@/screens/Register"
import Map from "@/screens/Map"
import Profile from "@/screens/Profile"
import Admin from "@/screens/Admin"
import { AuthProvider, useAuth } from "@/utils/AuthContext"

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuth()
  return isAuthenticated && user?.role === "admin" ? <>{children}</> : <Navigate to="/map" />
}

export default function AppRouter() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/map"
              element={
                <ProtectedRoute>
                  <Map />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}

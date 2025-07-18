import type React from "react"

interface CardProps {
  children: React.ReactNode
  className?: string
  title?: string
}

export default function Card({ children, className = "", title }: CardProps) {
  return (
    <div className={`card ${className}`}>
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      {children}
    </div>
  )
}

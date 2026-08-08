'use client'

import { useState, useEffect } from 'react'
import { DashboardHeader } from './dashboard-header'
import { CommandModal } from './command-modal'
import { DataInjectorModal } from './data-injector-modal'
import { MentalOverdriveModal } from './mental-overdrive-modal'

export function DashboardWrapper({ children }: { children: React.ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isInjectorOpen, setIsInjectorOpen] = useState(false)
  const [isOverdriveOpen, setIsOverdriveOpen] = useState(false)

  // Global keyboard shortcut for Mental Overdrive (Ctrl+M)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
        e.preventDefault()
        setIsOverdriveOpen(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <DashboardHeader onOpenModal={() => setIsInjectorOpen(true)} />
      {children}
      <CommandModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <DataInjectorModal isOpen={isInjectorOpen} onClose={() => setIsInjectorOpen(false)} />
      <MentalOverdriveModal isOpen={isOverdriveOpen} onClose={() => setIsOverdriveOpen(false)} />
    </>
  )
}

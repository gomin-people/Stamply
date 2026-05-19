'use client'

import { type ReactNode, useEffect, useState } from 'react'

interface ModalProps {
  enable: boolean
  onClose: () => void
  children?: ReactNode
}

const Modal = ({ enable, onClose, children }: ModalProps) => {
  const [modalOpen, setModalOpen] = useState<boolean>(enable)

  useEffect(() => {
    if (enable) return

    const timer = setTimeout(() => {
      setModalOpen(false)
    }, 250)

    return () => clearTimeout(timer)
  }, [enable])

  return (
    <>
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className={`fixed inset-0 bg-black transition-opacity duration-250 ${enable ? 'opacity-50' : 'opacity-0'}`}
            onClick={onClose}
          />
          <div
            className={`relative z-10 w-full max-w-sm rounded-xl bg-white p-6 shadow-lg transition-all duration-250 ${enable ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          >
            {children}
          </div>
        </div>
      )}
    </>
  )
}

export default Modal

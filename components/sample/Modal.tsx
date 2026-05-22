'use client'

import { type ReactNode, useEffect, useState } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children?: ReactNode
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  const [modalOpen, setModalOpen] = useState<boolean>(isOpen)

  useEffect(() => {
    if (isOpen) {
      // 닫힘 애니메이션이 끝난 뒤 언마운트하기 위해 isOpen과 마운트 상태를 분리한다.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setModalOpen(true)
      return
    }

    const timer = setTimeout(() => {
      setModalOpen(false)
    }, 250)

    return () => clearTimeout(timer)
  }, [isOpen])

  return (
    <>
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className={`fixed inset-0 bg-black transition-opacity duration-250 ${isOpen ? 'opacity-50' : 'opacity-0'}`}
            onClick={onClose}
          />
          <div
            className={`relative z-10 w-full max-w-sm rounded-xl bg-white p-6 shadow-lg transition-all duration-250 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          >
            {children}
          </div>
        </div>
      )}
    </>
  )
}

export default Modal

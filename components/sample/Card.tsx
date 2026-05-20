'use client'

import { type ComponentProps, type ReactNode } from 'react'
import Image from 'next/image'
import { cn } from '@/utils'

export type CardProps = ComponentProps<'div'> & {
    icon?: ReactNode 
    imageUrl?: string 
    imageAlt?: string  
}

const Card = ({ icon, imageUrl, imageAlt, children, className, ...rest }: CardProps) => {
    return (
        <div className={cn('rounded-xl border border-gray-200 p-4 shadow-sm', className)} {...rest}>
            {imageUrl && <Image src={imageUrl} alt={imageAlt ?? ''} width={0} height={0} sizes="100vw" className="w-full h-auto" />}
            {icon && <div>{icon}</div>}
            {children}
        </div>
    )
}

export default Card
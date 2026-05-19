'use client'

import { type ComponentProps } from 'react'
import { cn } from '@/utils'

type ButtonProps = ComponentProps<'button'> & {
    variant?: 'primary' | 'outline' | 'ghost' | 'kakao'
}

const variantStyles = {
    primary: 'bg-violet-600 text-white',
    outline: 'border border-violet-600 text-violet-600',
    ghost: 'text-violet-600',
    kakao: 'bg-yellow-400 text-black',
}
const Button = ({ children, variant = 'primary', className, disabled, ...rest }: ButtonProps) => {
    return (
        <button disabled={disabled} className={cn(variantStyles[variant], disabled && 'opacity-50 cursor-not-allowed', className)} {...rest}>
            {children}
        </button>
    )

}

export default Button
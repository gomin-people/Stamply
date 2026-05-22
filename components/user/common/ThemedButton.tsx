import { type ComponentProps } from 'react';
import { cn } from '@/utils';

type ThemedButtonProps = ComponentProps<'button'>

const ThemedButton = ({ children, className, ...rest }: ThemedButtonProps) => {
    return (
        <button
            className={cn('w-full max-w-76 h-17.5 rounded-[20px] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] text-white text-2xl font-bold transition-opacity active:opacity-80', className)}
            style={{ backgroundColor: 'var(--primary-color)' }}
            {...rest}
        >
            {children}
        </button>
    );
}

export default ThemedButton

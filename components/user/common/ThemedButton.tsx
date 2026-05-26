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

//여전히 이 컴포넌트는 client가 필요함. qr 체크하기에서 리워드 받기로 변해야하는등의 useState가 필요 단 필요할때 추가바람.

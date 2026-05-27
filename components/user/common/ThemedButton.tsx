import { type ComponentProps } from 'react';
import { cn } from '@/utils';

type ThemedButtonProps = ComponentProps<'button'>

const ThemedButton = ({ children, className, ...rest }: ThemedButtonProps) => {
    return (
        <button
            className={cn(
                'w-full max-w-76 h-14 rounded-[20px] text-white font-sans font-extrabold text-lg transition-all duration-300 active:scale-[0.97] hover:scale-[1.01] flex items-center justify-center gap-2',
                className
            )}
            style={{
                backgroundColor: 'var(--primary-700)',
                boxShadow: '0 8px 30px var(--primary-200)',
            }}
            {...rest}
        >
            {children}
        </button>
    );
}

export default ThemedButton;

//여전히 이 컴포넌트는 client가 필요함. qr 체크하기에서 리워드 받기로 변해야하는등의 useState가 필요 단 필요할때 추가바람.

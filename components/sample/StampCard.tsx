import Image from 'next/image'
import { cn } from '@/utils'
import Card, { type CardProps } from './Card'

type StampCardProps = CardProps & {
    isStamped: boolean
}

const StampCard = ({ isStamped, children, className, ...rest }: StampCardProps) => {
    return (
        <Card className={cn('relative flex items-center justify-center', className)} {...rest}>
            <div className={cn('relative w-full h-full transition-all duration-300', isStamped ? 'scale-100 opacity-100' : 'scale-0 opacity-0')}>
                <Image src="/images/icon_stamply.svg" alt="stamp" fill className="object-contain" />
            </div>
            {children}
        </Card>
    )
}

export default StampCard
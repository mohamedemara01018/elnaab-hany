import Link from 'next/link'
import { BoltIcon } from '@/utils/icons.utils';

function Logo() {
    return (
        <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-shadow">
                <BoltIcon className={'text-on-primary'} />
            </div>
            <span className="font-['Geist'] font-semibold text-[24px] leading-8 text-primary">GigFlow</span>
        </Link>
    )
}

export default Logo
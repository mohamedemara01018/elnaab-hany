import { ReactNode } from 'react'
import { Navbar } from './navbar'
import { Footer } from './footer'

function PublicLayout({ children }: { children: ReactNode }) {
    return (
        <div className="bg-background text-foreground min-h-screen">
            <Navbar />
            {children}
            <Footer />
        </div>
    )
}

export default PublicLayout
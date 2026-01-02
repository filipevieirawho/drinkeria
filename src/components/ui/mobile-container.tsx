import { cn } from "@/lib/utils"

export function MobileContainer({
    children,
    className,
}: {
    children: React.ReactNode
    className?: string
}) {
    return (
        <div className="min-h-screen bg-muted/30 flex justify-center">
            <div
                className={cn(
                    "w-full max-w-md min-h-screen bg-background shadow-xl",
                    className
                )}
            >
                {children}
            </div>
        </div>
    )
}

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Martini } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="bg-primary/10 p-4 rounded-full">
            <Martini className="h-12 w-12 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl mb-4">
          Drinker.IA
        </h1>
        <p className="text-muted-foreground text-lg">
          Sistema de Gestão para Eventos
        </p>
        <div className="pt-4">
          <Button asChild size="lg" className="w-full">
            <Link href="/admin">Access Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

import { Separator } from "@/components/ui/separator"

export function NotFound() {
  return (
    <main className="bg-white" style={{ padding: 0 }}>
      <section className="grid grid-flow-col items-center justify-center h-screen">
        <div className="grid grid-flow-col items-center gap-6 justify-center ">
          <h1 className="text-xl font-medium">404</h1>
          <Separator orientation="vertical" />
          <p className="text-md">Page non trouvée</p>
        </div>
      </section>
    </main>
  )
}

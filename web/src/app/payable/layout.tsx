import Header from "../components/Header"

export default function PayableLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header/>
      <main className="flex w-100 h-100 justify-center items-center">
        {children}
      </main>
    </>
  )
}
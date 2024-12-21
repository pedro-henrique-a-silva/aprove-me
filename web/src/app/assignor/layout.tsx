import Header from "../components/Header"

export default function AssignorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header/>
      <div className="flex w-100 h-100 justify-center items-center">
        <main>{children}</main>
      </div>
    </>
  )
}
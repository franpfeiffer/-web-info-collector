import { getServerSession } from "next-auth/next"
import { authOptions } from "./lib/auth"
import WebsiteList from './components/WebsiteList'
import prisma from './lib/prisma'
import Link from 'next/link'

export default async function Home() {
  const session = await getServerSession(authOptions)

  let userSearches = []
  if (session?.user?.name) {
    const user = await prisma.user.findUnique({
      where: { username: session.user.name },
      include: { searches: true },
    })
    userSearches = user?.searches || []
  }

  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Recopilador de Información Web</h1>
        <div>
          {session ? (
            <span>Bienvenido, {session.user?.name}</span>
          ) : (
            <>
              <Link href="/login" className="text-blue-500 hover:text-blue-700 mr-4">Iniciar sesión</Link>
              <Link href="/register" className="text-blue-500 hover:text-blue-700">Registrarse</Link>
            </>
          )}
        </div>
      </div>
      <WebsiteList initialSearches={userSearches} />
    </main>
  )
}

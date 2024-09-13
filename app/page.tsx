import { getServerSession } from "next-auth/next"
import { authOptions } from "./lib/auth"
import { redirect } from "next/navigation"
import WebsiteList from './components/WebsiteList'
import prisma from './lib/prisma'

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { username: session.user?.name },
    include: { searches: true },
  })

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">SnipNews</h1>
      <WebsiteList initialSearches={user?.searches || []} />
    </main>
  )
}

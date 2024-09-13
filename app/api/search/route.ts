import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../lib/auth"
import prisma from '../../lib/prisma'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const data = await req.json()

  try {
    const user = await prisma.user.findUnique({
      where: { username: session.user?.name },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const search = await prisma.search.create({
      data: {
        url: data.url,
        title: data.title,
        userId: user.id,
      },
    })

    return NextResponse.json(search)
  } catch (error) {
    console.error('Error saving search:', error)
    return NextResponse.json({ error: 'Failed to save search' }, { status: 500 })
  }
}

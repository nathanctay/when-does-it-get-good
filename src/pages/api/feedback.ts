import type { APIRoute } from 'astro'
import { prisma } from '../../lib/prisma'

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json()
    const { email, subject, message } = data

    if (!email || !message) {
      return new Response(JSON.stringify({ error: 'Email and message are required' }), { status: 400 })
    }

    await prisma.feedback.create({
      data: {
        email,
        subject: subject || null,
        message,
        created_at: new Date()
      }
    })

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error in feedback API:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 })
  }
}

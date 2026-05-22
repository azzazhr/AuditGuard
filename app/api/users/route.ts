import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabase.auth.admin.listUsers()

  if (error) {
    console.error('Supabase listUsers error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const users = data.users.map((user) => {
    const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Pengguna'
    const parts = name.trim().split(' ')
    const initials = parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase()

    return {
      id: user.id,
      name,
      email: user.email || '',
      role: user.user_metadata?.role || 'Auditor',
      status: 'aktif',
      initials,
    }
  })

  return NextResponse.json({ users })
}

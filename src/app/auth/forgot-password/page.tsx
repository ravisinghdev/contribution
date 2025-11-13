// app/forgot-password/page.tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isSent, setIsSent] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // This is the URL your user will be sent to *from their email*
    const resetUrl = `${location.origin}/auth/reset-password`

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: resetUrl,
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Password reset link sent! Check your email.')
      setIsSent(true)
    }
  }

  if (isSent) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-md">
                <CardHeader>
                <CardTitle className="text-2xl">Check your email</CardTitle>
                <CardDescription>
                    We&apos;ve sent a password reset link to <strong>{email}</strong>.
                </CardDescription>
                </CardHeader>
                <CardContent>
                    <Link href="/login">
                        <Button variant="outline" className="w-full">Back to Login</Button>
                    </Link>
                </CardContent>
            </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email and we&apos;ll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>
              <Button type="submit" className="w-full">
                Send Reset Link
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/login">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
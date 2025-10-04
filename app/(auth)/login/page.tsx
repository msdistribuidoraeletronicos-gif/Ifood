// app/(auth)/login/page.tsx

"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        // Aqui passamos os dados extras que nosso Trigger vai usar!
        data: {
          name: name,
        }
      }
    })

    if (error) {
      setError(error.message)
    } else {
      // Por padrão, o Supabase envia um e-mail de confirmação.
      // Para este projeto, vamos fazer login direto.
      await handleLogin(e)
    }
    setLoading(false)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) {
      setError(error.message)
    } else if (data.user) {
      // Login bem-sucedido! Redireciona para a página principal.
      router.push('/')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">
            {authMode === 'login' ? 'Acessar Plataforma' : 'Criar Conta'}
          </CardTitle>
          <CardDescription>
            {authMode === 'login' 
              ? 'Use seu e-mail e senha para entrar.' 
              : 'Preencha os dados para se registrar.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={authMode === 'login' ? handleLogin : handleRegister} className="space-y-4">
            {authMode === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="Seu nome" 
                  required 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="seu@email.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Sua senha" 
                required 
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading 
                ? 'Aguarde...' 
                : (authMode === 'login' ? 'Entrar' : 'Criar Conta')
              }
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            {authMode === 'login' ? 'Não tem uma conta?' : 'Já tem uma conta?'}
            <Button 
              variant="link" 
              className="pl-1"
              onClick={() => {
                setAuthMode(authMode === 'login' ? 'register' : 'login')
                setError(null)
              }}
            >
              {authMode === 'login' ? 'Cadastre-se' : 'Faça login'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
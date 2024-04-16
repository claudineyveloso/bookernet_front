"use client"
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

export default function LoginForm() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
    };

    signIn("credentials", {
      ...data,
      callbackUrl: '/dashboard'
    })
  }

  return (
    <form onSubmit={login} className="bg-white p-12 rounded-lg w-96 max-w-full flex justify-center items-center flex-col gap-2">
      <h2 className="font-bold text-xl mb-3">Faça seu login</h2>
      <input
        name="email"
        type="email"
        placeholder="Email"
        className="input input-primary w-full"
      />
      <input
        name="password"
        type="password"
        placeholder="Senha"
        className="input input-primary w-full"
      />
      <button className="btn btn-primary w-full" type="submit">Login</button>
      {error === 'CredentialsSignin' && <div className='text-red-600'>Erro no login</div>}
    </form>
  )
}

"use client"
import React, { useContext, useState } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../layout/context/layoutcontext'
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image';

const LoginPage = () => {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const [checked, setChecked] = useState(false);
  const { layoutConfig } = useContext(LayoutContext);

  const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

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
    <div className={containerClassName}>
      <div className="flex flex-column align-items-center justify-content-center">
        <Image src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" width={84} height={62} />
        <div
          style={{
            borderRadius: '56px',
            padding: '0.3rem',
            background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
          }}
        >
          <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
            <div className="text-center mb-5">
              <div className="text-900 text-3xl font-medium mb-3">Bem vindo ao Bookernet!</div>
              <span className="text-600 font-medium">Faça login para continuar</span>
            </div>
            <form onSubmit={login}>
              <div>
                <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                  Email
                </label>
                <InputText id="email" name="email" type="text" placeholder="Endereço de Email" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} />

                <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                  Senha
                </label>
                <Password inputId="password1" name="password" placeholder="Senha" toggleMask className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem"></Password>
                <div className="flex align-items-center justify-content-between mb-5 gap-5">
                  <div className="flex align-items-center">
                    <Checkbox inputId="rememberme1" checked={checked} onChange={(e) => setChecked(e.checked ?? false)} className="mr-2"></Checkbox>
                    <label htmlFor="rememberme1">Manter-se conectado</label>
                  </div>
                  <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                    Esquceu sua senha?
                  </a>
                </div>
                <Button label="Entrar" className="w-full p-3 text-xl" type="submit"></Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

  )

}

export default LoginPage

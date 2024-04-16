"use client"

import { signOut } from "next-auth/react"

export default function LogoutButton() {
  return (
    <button className="btn btn-outline text-red-600" onClick={() => signOut()}>Sair</button>
  )
}

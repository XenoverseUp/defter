"use client"

import { authClient } from "@/lib/auth-client"

import { Loader, LogOut } from "lucide-react"
import { Button } from "../ui/button"
import { useRouter } from "@/i18n/navigation"
import { useState } from "react"
import { toast } from "sonner"

export function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    setLoading(true)
    try {
      await authClient.signOut()

      toast.success("Logged out successfully.")
      router.push("/")
      router.refresh()
    } catch {
      setLoading(false)
    }
  }

  return (
    <Button variant="ghost" onClick={handleLogout} size="icon">
      {loading ? <Loader className="animate-spin" /> : <LogOut />}
    </Button>
  )
}

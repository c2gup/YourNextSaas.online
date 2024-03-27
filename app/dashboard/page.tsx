'use client'
import Dashboard from "@/components/Dashboard"
import Loading from "@/components/Loading"
import Navbar from "@/components/Navbar"
import supabaseClient from "@/utils/supabase-connect"
import { signOut, useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"

const Page = () => {
  const { data: session } = useSession()
  const email = session?.user?.email
  const [active, setActive] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true) // Set loading to true initially

  const fetchData = async () => {
    try {
      const { data: user } = await supabaseClient.from("users").select("active").eq("email", email)
      if (user !== null && user[0].active === true) {
        setActive(true)
        setLoading(false)
      } else {
        setActive(false)
        setLoading(false)
      }
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [email]) // Fetch data whenever email changes

  if (loading) {
    return <Loading /> // or any other loading indicator
  }

  if (!session) {
    redirect("/")
  }

  const handleClick = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data, error } = await supabaseClient.from("users").update({ active: true }).eq("email", email)
    if (error) throw error
    console.log(data);
  }

  return (
    <div>
      <Navbar />
      <Dashboard />
    </div>
  )
}

export default Page


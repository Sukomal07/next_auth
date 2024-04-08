'use client'

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Home() {
  const router = useRouter()
  const [data, setData]: any = useState()
  const handleLogout = async () => {
    try {
      const res = await axios.get("/api/users/logout")
      if (res.data?.success) {
        toast.success(res.data?.message)
        router.push('/login')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error)
    }
  }
  const handleSendEmail = async () => {
    try {
      toast.loading("Sending email...")
      const res = await axios.post("/api/users/sendverifyemail")
      if (res.data?.success) {
        toast.dismiss()
        toast.success(res.data?.message)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error)
    }
  }

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get('/api/users/profile')
      setData(res.data?.user)
    }
    fetchData()
  }, [])
  return (
    <section className="h-screen flex flex-col justify-center items-center">
      <div className="flex flex-col gap-5 w-auto min-w-[500px]  shadow-xl shadow-slate-500 drop-shadow-lg p-8 justify-center items-center rounded-md">
        <h1 className="text-4xl text-gray-700">Profile</h1>
        <div className="flex gap-2 w-full items-center">
          <h1 className="text-2xl font-bold text-gray-600">Name :</h1>
          <h2 className="text-xl font-semibold text-blue-600">{data?.name}</h2>
        </div>
        <div className="flex gap-2 w-full items-center">
          <h1 className="text-2xl font-bold text-gray-600">Username :</h1>
          <h2 className="text-xl font-semibold text-blue-600">{data?.username}</h2>
        </div>
        <div className="flex gap-2 w-full items-center">
          <h1 className="text-2xl font-bold text-gray-600">Email :</h1>
          <h2 className="text-xl font-semibold text-blue-600 mr-auto">{data?.email}</h2>
          {data?.isVerified ? (
            <button className="bg-green-600 text-white px-8 py-1 rounded-md">Verified</button>
          ) : (
            <button onClick={handleSendEmail} className="bg-red-600 text-white px-8 py-1 rounded-md">Verify</button>
          )}
        </div>
        <button onClick={handleLogout} className="bg-blue-600 text-white rounded-md w-full p-2 text-xl hover:bg-white hover:text-slate-600">Log out</button>
      </div>
    </section>
  );
}

'use client'
import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from 'react-hot-toast';
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Signup() {
    const router = useRouter()
    const [data, setData] = useState({
        username: "",
        name: "",
        email: "",
        password: ""
    })
    const [disabled, setDisabled] = useState(true)
    const [loading, setLoading] = useState(false)

    const handleChange = (e: any) => {
        const { name, value } = e.target
        setData(prevData => ({
            ...prevData,
            [name]: value
        }));

    }
    const handleSignup = async (event: any) => {
        event.preventDefault()
        try {
            setLoading(true)
            const res = await axios.post("/api/users/signup", data)
            if (res.data?.success) {
                toast.success(res.data?.message)
                setLoading(false)
                setData({
                    username: "",
                    name: "",
                    email: "",
                    password: ""
                })
                router.push('/login')
            }
        } catch (error: any) {
            setLoading(false)
            toast.error(error.response?.data?.error)
        }
    }


    useEffect(() => {
        if (data.email.length > 0 && data.name.length > 0 && data.password.length > 0 && data.username.length > 0) {
            setDisabled(false)
        }
    }, [data])
    return (
        <section className="h-screen flex flex-col justify-center items-center">
            <form onSubmit={handleSignup} className="flex flex-col gap-5 w-[400px]  shadow-xl shadow-slate-500 drop-shadow-lg p-8 justify-center items-center rounded-md">
                <h1 className="text-4xl text-gray-700">Sign up</h1>
                <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="username" className="text-gray-600">Username</label>
                    <input className="rounded-md border-2 outline-none px-2 py-1 border-gray-700" type="text" name="username" id="username" value={data.username} onChange={(e) => handleChange(e)} />
                </div>
                <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="name" className="text-gray-600">Name</label>
                    <input className="rounded-md border-2 outline-none px-2 py-1 border-gray-700" type="text" name="name" id="name" value={data.name} onChange={(e) => handleChange(e)} />
                </div>
                <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="email" className="text-gray-600">Email</label>
                    <input className="rounded-md border-2 outline-none px-2 py-1 border-gray-700" type="email" name="email" id="email" value={data.email} onChange={(e) => handleChange(e)} />
                </div>
                <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="password" className="text-gray-600">Password</label>
                    <input className="rounded-md border-2 outline-none px-2 py-1 border-gray-700" type="password" name="password" id="password" value={data.password} onChange={(e) => handleChange(e)} />
                </div>
                <button type="submit" disabled={disabled} className="bg-blue-600 text-white w-full p-2 rounded-md text-xl hover:bg-white  hover:text-gray-600 transition duration-300 ease-in-out">{loading ? 'Wait...' : 'Submit'}</button>
                <p className="text-slate-600">Already have an account <Link href={'/login'} className="underline cursor-pointer text-blue-600">Login</Link></p>
            </form>
        </section>
    )
}
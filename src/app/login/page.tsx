'use client'
import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from 'react-hot-toast';
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
    const router = useRouter()
    const [data, setData] = useState({
        usernameOremail: "",
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
            const res = await axios.post("/api/users/login", data)
            if (res.data?.success) {
                toast.success(res.data?.message)
                setLoading(false)
                setData({
                    usernameOremail: "",
                    password: ""
                })
                router.push('/')
            }
        } catch (error: any) {
            setLoading(false)
            toast.error(error.response?.data?.error)
        }
    }


    useEffect(() => {
        if (data.usernameOremail.length > 0 && data.password.length > 0) {
            setDisabled(false)
        }
    }, [data])
    return (
        <section className="h-screen flex flex-col justify-center items-center">
            <form onSubmit={handleSignup} className="flex flex-col gap-5 w-[400px]  shadow-xl shadow-slate-500 drop-shadow-lg p-8 justify-center items-center rounded-md">
                <h1 className="text-4xl text-gray-700">Log in</h1>
                <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="usernameOremail" className="text-gray-600">Username or Email</label>
                    <input className="rounded-md border-2 outline-none px-2 py-1 border-gray-700" type="text" name="usernameOremail" id="usernameOremail" value={data.usernameOremail} onChange={(e) => handleChange(e)} />
                </div>
                <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="password" className="text-gray-600">Password</label>
                    <input className="rounded-md border-2 outline-none px-2 py-1 border-gray-700" type="password" name="password" id="password" value={data.password} onChange={(e) => handleChange(e)} />
                </div>
                {
                    loading ? (
                        <button className="bg-blue-600 flex items-center justify-center gap-4 text-white w-full p-2 rounded-md text-xl" disabled>
                            <svg aria-hidden="true" className="w-5 h-85 text-gray-200 animate-spin dark:text-gray-600 fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                            Processing...
                        </button>
                    ) : (
                        <button type="submit" disabled={disabled} className="bg-blue-600 text-white w-full p-2 rounded-md text-xl hover:bg-white  hover:text-gray-600 transition duration-300 ease-in-out">Submit</button>
                    )
                }

                <p className="text-slate-600">Don&apos;t have an account <Link href={'/signup'} className="underline cursor-pointer text-blue-600">Sign up</Link></p>
            </form>
        </section>
    )
}
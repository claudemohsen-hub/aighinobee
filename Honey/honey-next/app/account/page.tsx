"use client"
 import {useState, useEffect} from "react"
 export default function AccountPage() {
    const [user, setUser] = useState<any>(null)
    useEffect( () => {
        fetch("/api/me")
    .then((res) => res.json())
    .then((data) => setUser(data))
    },[])
    return (
        <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">حساب کاربری</h1>
        <p>نام: {user?.name}</p>
        <p>شماره موبایل: {user?.phone}</p>
        </div>
    )
    }
 
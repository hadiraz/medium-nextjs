import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

function Header() {
  return (
    <header className="max-w-7xl flex justify-between py-2 px-2 mx-auto">
        <div className="flex items-center">
            <Link href="/">
                <Image src='https://links.papareact.com/yvf' alt="home" height={50} width={140}/>
            </Link>
            <ul className="h-100 space-x-5 hidden md:inline-flex justify-center items-center">
                <li>About</li>
                <li>Contact</li>
                <li className="bg-green-600 text-white px-4 py-1 rounded-full cursor-pointer">Follow</li>
            </ul>
        </div>
        <div className="flex justify-center items-center space-x-5 text-green-600">
            <h3>Sign In</h3>
            <h3 className="rounded-full border px-4 py-1 border-green-600 cursor-pointer">Get Started</h3>
        </div>
    </header>
  )
}

export default Header
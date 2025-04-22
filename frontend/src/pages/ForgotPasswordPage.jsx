import React from 'react'
import { motion } from "framer-motion"
import { useState } from 'react'
import { useAuthStore } from "../store/authStore"
import Input from '../components/Input'
import { ArrowLeft, Loader, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [isSubmitted, setIsSubmitted] = useState(false)

    const { isLoading, forgotPassword } = useAuthStore()

    const handleSubmit = async (e) => {
        e.preventDefault();
        await forgotPassword(email)
        setIsSubmitted(true)
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className='max-w-md w-full mx-auto mt-10 p-2 bg-gray-900 opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800'
        >
            <div className='p-8'>
                <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-500 to-emerald-500 text-transparent bg-clip-text'>
                    Forgot Password
                </h2>

                {!isSubmitted ? (
                    <form onSubmit={handleSubmit}>
                        <p className='text-gray-600 mb-6 text-center'>
                            Enter your email address and we'll send you a link to reset your password.
                        </p>

                        <Input
                            icon={Mail}
                            type='email'
                            placeholder='Email Address'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type='submit'
                            className='w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
				font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
				 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900'
                        >
                            {isLoading ? <Loader className='size-6 animate-spin mx-auto' /> : "Send Reset Link"}
                        </motion.button>

                    </form>
                ) : (
                    <div className='text-center'>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        >
                            <Mail className='h-8 w-8 text-white' />
                        </motion.div>
                        <p className='text-gray-300 mb-6'>
                            If an account exists for {email}, you will receive a password reset link shortly.
                        </p>
                    </div>
                )}
            </div>

            <div className='px-8 py-4 bg-gray-900 flex justify-center'>
                <Link to={'/login'} className='text-sm text-green-400 hover:underline flex items-center'>
                    <ArrowLeft className='h-4 w-4 mr-2' /> Back to Login
                </Link>
            </div>
        </motion.div>
    )
}

export default ForgotPasswordPage
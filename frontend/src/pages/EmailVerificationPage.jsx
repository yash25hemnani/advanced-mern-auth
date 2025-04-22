import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Loader } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

function EmailVerificationPage() {
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const inputRefs = useRef([])
  const navigate = useNavigate()

  const { error, isLoading, verifyEmail } = useAuthStore()

  const handleChange = (index, value) => {
    const newCode = [...code]

    // Handle Pasted Content
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("")
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || ""
      }

      setCode(newCode)
      // Focus on last non empty element or the first empty one
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "")

      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5

      inputRefs.current[focusIndex].focus()

    } else {
      const filledCount = newCode.filter(d => d !== "").length
      console.log(filledCount);
      if (filledCount >= 6 && value !== "") { // This value variable is needed because without it backspace will also be prevented.
        console.log("filled count: ", filledCount);
        return;
      } else {
        console.log("Not filled");
      }

      newCode[index] = value
      setCode(newCode)

      // Move focus to the next input field if value is entered
      if (value && index < 5) {
        console.log(index + 1);
        console.log(code);
        inputRefs.current[index + 1].focus()
      }
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const verificationCode = code.join("");
    try {
      await verifyEmail(verificationCode)
      console.log("Verified");
      toast.success("Email verified successfully.")
      navigate('/')
    } catch (error) {
      console.log(error);
    }
  }

  // Auto submit when all fields are filled
  useEffect(() => {
    if (code.every(digit => digit !== '')) {
      handleSubmit(new Event('submit'))
    }
  }, [code])


  return (
    <div className='max-w-md w-full bg-gray-800 opacity-50 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'>
      <div className='p-8'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='max-w-md w-full bg-gray-800 opacity-80 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl'
        >
          <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
            Welcome Back
          </h2>

          <p className='text-center text-gray-300 mb-6'>
            Enter the 6-Digit Code sent to your email address
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className='flex justify-between'>
              {code.map((digit, index) => {
                return <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el }}
                  type='text'
                  maxLength='6'
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className='w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-900 rounded-lg focus:border-green-500 focus:outline-none'
                />
              })}
            </div>

            {error && <p className='text-red-500 font-semibold mt-2'>{error}</p>}

            <motion.button
              className='w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none foucs:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 cursor-pointer'
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type='submit'
              disabled={isLoading}
            >
              {isLoading ? <Loader className='w-6 h-6 mx-auto animate-spin' /> : "Verify Email"}
            </motion.button>
          </form>

        </motion.div>
      </div>
    </div>
  )
}

export default EmailVerificationPage
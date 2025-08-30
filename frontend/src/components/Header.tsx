import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

const Header = () => {
    const navigate = useNavigate()
    const { token } = useContext(AuthContext)   // ✅ check login state

    const handleGetStarted = () => {
        if (token) {
            // ✅ already logged in → go to notes
            navigate('/notes')
        } else {
            // ✅ not logged in → open signup page (not login)
            navigate('/login', { state: { mode: "SignUp" } })
        }
    }

    return (
        <div className='flex flex-col items-center mt-2 px-4 text-center text-gray-800'>
            <img src={assets.header_img} alt="" className='w-36 h-36 rounded-full mb-4' />
            <h1 className='flex items-center gap-2 text-xl sm:text-5xl font-medium mb-2'>Hey Developer
                <img src={assets.hand_wave} alt="" className='w-8 aspect-square' /></h1>
            <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcome to our app</h2>
            <p className='mb-8 max-w-md'>Let's start with quick product tour and we will have you up and running in no time!</p>
            <button
                onClick={handleGetStarted}
                className='border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all cursor-pointer'>
                Get Started
            </button>
        </div >
    )
}

export default Header

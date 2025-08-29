import Header from '../components/Header'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
const WelcomeScreen = () => {
    const navigate = useNavigate();
    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-[url("/bg_img.png")] bg-cover bg-center'>
            <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absoluter top-0'>
                <img src={assets.logo} alt="" className='w-28 sm:w-32' />
                <button onClick={() => navigate('/login')} className='flex items-center gap-2 cursor-pointer border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all'>Login <img src={assets.arrow_icon} alt="" /></button>
            </div >
            <Header />
        </div>
    )
}

export default WelcomeScreen;

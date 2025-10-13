import { useState ,useEffect } from "react"
import { useSelector,useDispatch } from "react-redux"
import { Link  } from "react-router-dom"
import { setCredientials } from "../../redux/features/auth/authSlice"
//import Loader from "../../components/Loader"
import {toast} from 'react-toastify'
import { useProfileMutation } from "../../redux/api/usersApiSlice"
import { FaUserCircle, FaSave, FaListAlt } from "react-icons/fa";


const Profile = () => {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const {userInfo} = useSelector(state => state.auth);
  const [updateProfile , {isLoading :loadingUpdateProfile}] = useProfileMutation();

  useEffect(() =>{
    setUsername(userInfo.username);
    setEmail(userInfo.email);

  },[userInfo.username ,userInfo.email]);

  const dispatch = useDispatch();
  
  const submitHandler =  async(e) =>{
    e.preventDefault();
    if (password!== confirmPassword){
      toast.error('Passwords do not match');
    }else {
      try {
        const res = await updateProfile(
          {_id:userInfo._id ,username,email,password}).unwrap();
        dispatch(setCredientials({...res}));
        toast.success('profile updated successfully');
      } catch (error) {
        toast.error(error?.data?.message|| error.message)
      }
    }
  }

return (
    <div className="flex justify-center items-start py-10 pt-16 bg-[#0D1117] min-h-screen">
  <div className="w-full max-w-lg bg-gray-900 p-8 rounded-xl shadow-2xl border border-gray-800 mx-4 sm:mx-0">

        {/* العنوان */}
        <h2 className="text-3xl font-extrabold text-white text-center mb-8 flex items-center
             justify-center border-b border-pink-600/50 pb-2">
            <FaUserCircle className="mr-3 text-pink-500" />
            Update Profile
        </h2>
        
        <form onSubmit={submitHandler} className="space-y-6"> 
            
            {/* حقل الاسم */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-300">
                Name
              </label>
              <input 
                type="text" 
                className="w-full p-3 rounded-lg bg-gray-800 text-white border-2 border-transparent
                 focus:border-pink-600 outline-none transition duration-200"
                placeholder="Enter your name"
                value={username}
                onChange={e => setUsername(e.target.value)} 
              />
            </div>

            {/* حقل الإيميل */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-300">
                Email
              </label>
              <input 
                type="email" 
                className="w-full p-3 rounded-lg bg-gray-800 text-white border-2 border-transparent 
                focus:border-pink-600 outline-none transition duration-200"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)} 
              />
            </div>

            {/* حقل كلمة المرور */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-300">
                Password
              </label>
              <input 
                type="password" 
                className="w-full p-3 rounded-lg bg-gray-800 text-white border-2 border-transparent
                 focus:border-pink-600 outline-none transition duration-200"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)} 
              />
            </div>

            {/* حقل تأكيد كلمة المرور */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-300">
                Confirm Password
              </label>
              <input 
                type="password" 
                className="w-full p-3 rounded-lg bg-gray-800 text-white border-2 
                border-transparent focus:border-pink-600 outline-none transition duration-200"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)} 
              />
            </div>
            
            {/* أزرار الإجراءات */}
            <div className="flex justify-between pt-4">
              <button 
                type="submit" 
                className="flex items-center bg-pink-600 text-white px-6 py-3 rounded-lg font-bold 
                         hover:bg-pink-700 transition duration-200 shadow-md"
              >
                <FaSave className="mr-2" />
                Update
              </button>
              
              <Link 
                to='/user-orders' 
                className="flex items-center bg-gray-700 text-white px-6 py-3 rounded-lg font-bold 
                           hover:bg-gray-600 transition duration-200 shadow-md"
              >
                <FaListAlt className="mr-2" />
                My Orders
              </Link>
            </div>
        </form>
      </div>

      {/* {loadingUpdateProfile && <Loader />} */}
    </div>
);
}

export default Profile
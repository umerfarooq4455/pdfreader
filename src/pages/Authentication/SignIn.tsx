import { FiMail, FiLock } from 'react-icons/fi';
import { Checkbox } from '@material-tailwind/react';
import { RxExit } from 'react-icons/rx';
import pdficon from '../../images/pdfreaderimages/pdficon.png';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { GoogleLogin } from '@react-oauth/google';
import FacebookLogin from 'react-facebook-login';
import { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { setAuthData } from '../../store/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useNavigate } from 'react-router-dom';
// Validation Schema using Yup
const schema = yup.object().shape({
  email: yup
    .string()
    .email('Enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  console.log('asdfasd', auth.user);
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    // Here you would call your backend API for login
    try {
      setLoginError(null);
      const response = await axios.post('/api/auth/login', data);
      console.log('Login successful', response);
      // Redirect user to dashboard or handle successful login
    } catch (error) {
      setLoginError('Invalid credentials, please try again.');
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse: any) => {
    try {
      const token = credentialResponse.credential;

      // Decode JWT token to get user data
      const decodedToken: any = jwtDecode(token);

      // Dispatch to Redux
      dispatch(setAuthData({ user: decodedToken, token }));

      // Save token to localStorage if needed
      localStorage.setItem('token', token);

      console.log('Google login successful, user data:', decodedToken);
      navigate('/dashboard');
    } catch (error) {
      console.error('Google login error', error);
    }
  };

  // Handle Facebook Login response
  const handleFacebookResponse = async (response: any) => {
    if (response.accessToken) {
      try {
        const fbResponse = await axios.post('/api/auth/facebook', {
          accessToken: response.accessToken,
          userID: response.userID,
        });
        console.log('Facebook login successful', fbResponse);
        // Handle successful Facebook login, like redirecting or storing token
      } catch (error) {
        console.error('Facebook login error', error);
      }
    }
  };

  return (
    <section className="h-screen flex flex-col lg:flex-row">
      {/* Left Section - Form */}
      <div className="flex-1 flex justify-center p-4 sm:p-8 lg:p-12 xl:p-16">
        <div className="w-full lg:max-w-md">
          <div className="text-3xl lg:mt-8 lg:mb-15 flex items-center justify-center sm:text-4xl lg:text-5xl font-bold text-[#1E201F] mb-4">
            <img src={pdficon} width={50} height={50} />
            <span className="text-red-700 text-xl sm:text-2xl lg:text-3xl font-bold text-[21px] ml-3  mr-3">
              PDF
            </span>
            <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-[21px] ">
              Reader
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1E201F] mb-4">
            Sign In
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-[#475569] font-normal">
            Welcome! Please enter your details to sign in.
          </p>
          <form className="mt-8 mb-2 w-full" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-1 flex flex-col gap-5">
              <div className="relative">
                <FiMail
                  className="absolute left-[14px] top-[16px]   text-gray-500"
                  size={20}
                />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="Address@mail.com"
                  className="pl-12 bg-[#255A7E17] borderfocuscolor p-3 rounded-[123px] w-full"
                />
                <p className="text-red-500">{errors.email?.message}</p>
              </div>
              <div className="relative">
                <FiLock
                  className="absolute left-[14px] top-[16px]   text-gray-500"
                  size={20}
                />
                <input
                  {...register('password')}
                  type="password"
                  placeholder="Password"
                  className="pl-12 bg-[#255A7E17] borderfocuscolor p-3 rounded-[123px] w-full"
                />
                <p className="text-red-500">{errors.password?.message}</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-1 mt-2">
              <div className="flex items-center gap-1">
                <Checkbox color="blue" />
                <span className="text-[#1E293B] text-[14px] font-semibold">
                  Remember Me
                </span>
              </div>
              <a href="#" className="text-[#2196f3] font-semibold text-[14px]">
                Forgot Password
              </a>
            </div>
            {loginError && <p className="text-red-500 mt-2">{loginError}</p>}
            <button
              type="submit"
              className="mt-5 flex justify-center font-semibold items-center w-full bg-[#2196f3] hover:bg-[#1c91ee] text-white p-[12px] rounded-[123px]"
            >
              Sign In
              <RxExit className="ml-2 font-semibold text-[18px] text-white" />
            </button>
            <div className="mt-5">
              <p className="text-center text-black text-[14px] font-semibold">
                Don’t have an account?{' '}
                <a
                  href="/auth/signup"
                  className="text-[#2196f3] font-semibold ml-1"
                >
                  Sign Up
                </a>
              </p>
            </div>
            <div className="flex mt-6 items-center justify-center space-x-4">
              <div className="flex-grow border-t border-[#CBD5E1]"></div>
              <span className="text-[12px] font-medium">OR</span>
              <div className="flex-grow border-t border-[#CBD5E1]"></div>
            </div>
            <div className="space-y-4 mt-8">
              <GoogleLogin
                shape="circle"
                width={400}
                onSuccess={handleGoogleLoginSuccess}
                onError={() => console.log('Google login failed')}
              />
              <FacebookLogin
                appId="45875625885064"
                fields="name,email,picture"
                callback={handleFacebookResponse}
                cssClass="w-full mt-5 flex items-center font-bold gap-2 justify-center shadow-md p-[12px] bg-white hover:bg-[#f9fcff] rounded-[123px]"
                icon="fa-facebook"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="flex-1 items-center justify-center h-full min-h-[500px] hidden lg:block">
        <img
          src="https://demos.creative-tim.com/material-tailwind-dashboard-react/img/pattern.png"
          alt="Login Image"
          className="w-full h-full min-h-[500px]"
        />
      </div>
    </section>
  );
};

export default SignIn;

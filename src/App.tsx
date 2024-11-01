import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ECommerce from './pages/Dashboard/ECommerce';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Loader from './common/Loader';
import routes from './routes';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { setAuthData } from './store/authSlice';
import { useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import ProtectedRoute from './pages/Authentication/ProtectedRoute';
const DefaultLayout = lazy(() => import('./layout/DefaultLayout'));

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      dispatch(setAuthData({ user: decodedToken, token }));
    }
  }, [dispatch]);
  const clientId =
    '791847966789-62i56cunsepk63g1iuv58d3ds0etl48k.apps.googleusercontent.com';
  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <GoogleOAuthProvider clientId={clientId}>
        <Toaster
          position="top-right"
          reverseOrder={false}
          containerClassName="overflow-auto"
        />
        <Routes>
          <Route index element={<SignIn />} />
          <Route path="/auth/signup" element={<SignUp />} />
          <Route element={<DefaultLayout />}>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <ECommerce />
                </ProtectedRoute>
              }
            />
            {routes.map((routes, index) => {
              const { path, component: Component } = routes;
              return (
                <Route
                  key={index}
                  path={path}
                  element={
                    <Suspense fallback={<Loader />}>
                      <Component />
                    </Suspense>
                  }
                />
              );
            })}
          </Route>
        </Routes>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;

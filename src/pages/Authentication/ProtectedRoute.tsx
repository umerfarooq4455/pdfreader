import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../../store/store';


const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const auth = useSelector((state: RootState) => state.auth);

  if (!auth.token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;

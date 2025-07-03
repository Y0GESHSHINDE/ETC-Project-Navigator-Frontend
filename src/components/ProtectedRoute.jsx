import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const apiMap = {
  admin: '/api/admin/admin-dashboard',
  faculty: '/api/faculty/faculty-dashboard',
  student: '/api/student/student-dashboard',
};

const ProtectedRoute = ({ children, role }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const checkAccess = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${apiBaseUrl}${apiMap[role]}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 200) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
      } catch (err) {
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [role]);

  if (loading) return <div className="text-center p-4">Checking access...</div>;

  return authorized ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;

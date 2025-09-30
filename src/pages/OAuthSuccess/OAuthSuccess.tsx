import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function OAuthSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      navigate('/signin?error=' + error);
      return;
    }

    if (token) {
      // Store token and redirect
      localStorage.setItem('authToken', token);
      
      // Fetch user profile with the token
      fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          localStorage.setItem('user', JSON.stringify(data.data.user));
          navigate('/editor');
        } else {
          navigate('/signin?error=oauth_failed');
        }
      })
      .catch(() => {
        navigate('/signin?error=oauth_failed');
      });
    } else {
      navigate('/signin');
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
}
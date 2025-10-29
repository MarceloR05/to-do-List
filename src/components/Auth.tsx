import { useState } from 'react';
import toast from 'react-hot-toast';
import { authApi } from '../services/api';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

interface AuthProps {
  onAuthSuccess: (token: string) => void;
}

export default function Auth({ onAuthSuccess }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = async (credentials: { email: string; password: string }) => {
    try {
      const response = await authApi.login(credentials);
      localStorage.setItem('token', response.token);
      onAuthSuccess(response.token);
      toast.success('¡Bienvenido de vuelta!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  const handleRegister = async (userData: { username: string; email: string; password: string }) => {
    try {
      const response = await authApi.register(userData);
      localStorage.setItem('token', response.token);
      onAuthSuccess(response.token);
      toast.success('¡Cuenta creada exitosamente!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al crear la cuenta');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center p-4">
      {isLogin ? (
        <LoginForm onSubmit={handleLogin} onToggleForm={() => setIsLogin(false)} />
      ) : (
        <RegisterForm onSubmit={handleRegister} onToggleForm={() => setIsLogin(true)} />
      )}
    </div>
  );
}
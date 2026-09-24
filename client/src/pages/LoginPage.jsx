import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <h2 className="text-xl font-bold text-white">Welcome back</h2>
        <p className="text-xs text-zinc-400">Enter your credentials to access your workspace</p>
      </div>

      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="alex@devtrack.io"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="flex items-center justify-between text-xs">
          <Link to="/forgot-password" className="text-indigo-400 hover:text-indigo-300">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" variant="primary" isLoading={isLoading} className="w-full mt-2">
          Sign In
        </Button>
      </form>

      <div className="text-center text-xs text-zinc-400">
        Don't have an account?{' '}
        <Link to="/register" className="text-indigo-400 font-semibold hover:text-indigo-300">
          Create one now
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;

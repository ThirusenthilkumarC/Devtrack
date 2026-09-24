import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <h2 className="text-xl font-bold text-white">Reset password</h2>
        <p className="text-xs text-zinc-400">Enter your email to receive password reset instructions</p>
      </div>

      {submitted ? (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 text-center">
          If an account exists for {email}, reset instructions have been dispatched.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="alex@devtrack.io"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" variant="primary" className="w-full mt-2">
            Send Reset Instructions
          </Button>
        </form>
      )}

      <div className="text-center text-xs text-zinc-400">
        Remember your password?{' '}
        <Link to="/login" className="text-indigo-400 font-semibold hover:text-indigo-300">
          Back to login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

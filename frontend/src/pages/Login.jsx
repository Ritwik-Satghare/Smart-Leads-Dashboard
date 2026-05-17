import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const schema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().min(6, 'At least 6 characters').required('Password is required'),
}).required();

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await login(data);
      toast.success('Welcome back!');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.message || 'Login failed. Try again.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-on-primary/30 blur-3xl" />
          <div className="absolute bottom-32 right-16 w-96 h-96 rounded-full bg-primary-fixed-dim/40 blur-3xl" />
        </div>
        <div className="relative z-10 text-center px-12 max-w-lg">
          <div className="w-16 h-16 rounded-xl bg-on-primary/20 flex items-center justify-center mx-auto mb-8">
            <span className="material-symbols-outlined text-on-primary text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>dataset</span>
          </div>
          <h1 className="text-display-lg text-on-primary mb-4">Smart Leads</h1>
          <p className="text-body-lg text-on-primary/80">
            Your premium CRM for managing leads, tracking conversions, and scaling your sales pipeline.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded bg-primary flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dataset</span>
            </div>
            <h1 className="text-headline-md font-bold text-primary">Smart Leads</h1>
          </div>

          <h2 className="text-headline-lg font-headline-lg text-on-surface mb-2">Sign in to your account</h2>
          <p className="text-body-md text-on-surface-variant mb-8">Enter your credentials to access the dashboard</p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div>
              <label htmlFor="login-email" className="block text-label-md text-on-surface mb-1.5">Email</label>
              <input
                id="login-email"
                {...register('email')}
                type="email"
                autoComplete="email"
                className={`w-full bg-surface-container-lowest border ${errors.email ? 'border-error' : 'border-outline-variant'} rounded-lg py-2.5 px-3 text-body-md focus:outline-none focus:ring-2 ${errors.email ? 'focus:ring-error/20 focus:border-error' : 'focus:ring-primary/20 focus:border-primary'} transition-all`}
                placeholder="you@company.com"
              />
              {errors.email && <p className="text-error text-label-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="login-password" className="block text-label-md text-on-surface mb-1.5">Password</label>
              <input
                id="login-password"
                {...register('password')}
                type="password"
                autoComplete="current-password"
                className={`w-full bg-surface-container-lowest border ${errors.password ? 'border-error' : 'border-outline-variant'} rounded-lg py-2.5 px-3 text-body-md focus:outline-none focus:ring-2 ${errors.password ? 'focus:ring-error/20 focus:border-error' : 'focus:ring-primary/20 focus:border-primary'} transition-all`}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-error text-label-sm mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-on-primary py-3 rounded-lg text-label-md font-label-md hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {submitting ? (
                <><div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" /> Signing in...</>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-body-sm text-on-surface-variant text-center mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-medium hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const schema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().min(6, 'At least 6 characters').required('Password is required'),
}).required();

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
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

  const fieldClass = (hasError) =>
    `w-full bg-surface dark:bg-dark-elevated border ${hasError ? 'border-danger' : 'border-border dark:border-dark-border'} rounded-lg py-2.5 px-3 text-body text-text-primary dark:text-dark-text placeholder:text-text-muted dark:placeholder:text-dark-text-muted focus:outline-none focus:ring-2 ${hasError ? 'focus:ring-danger/20 focus:border-danger' : 'focus:ring-primary/20 focus:border-primary'} transition-all`;

  return (
    <div className="min-h-screen bg-surface dark:bg-dark-bg flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute bottom-32 right-16 w-96 h-96 rounded-full bg-info/30 blur-3xl" />
        </div>
        <div className="relative z-10 text-center px-12 max-w-lg">
          <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center mx-auto mb-8">
            <span className="material-symbols-outlined text-white text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
          </div>
          <h1 className="text-[40px] font-bold text-white mb-4 leading-tight">
            Smart<span className="text-primary">Leads</span>
          </h1>
          <p className="text-body-lg text-slate-300">
            Your premium CRM for managing leads, tracking conversions, and scaling your sales pipeline.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative">
        <button
          onClick={toggleTheme}
          className="absolute top-4 right-4 p-2 rounded-lg text-text-muted dark:text-dark-text-muted hover:bg-border/30 dark:hover:bg-dark-elevated transition-colors"
          aria-label="Toggle dark mode"
        >
          <span className="material-symbols-outlined text-[20px]">{isDark ? 'light_mode' : 'dark_mode'}</span>
        </button>

        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
            </div>
            <h1 className="text-[20px] font-bold text-text-primary dark:text-dark-text">Smart<span className="text-primary">Leads</span></h1>
          </div>

          <h2 className="text-heading text-text-primary dark:text-dark-text mb-2">Sign in to your account</h2>
          <p className="text-body text-text-secondary dark:text-dark-text-secondary mb-8">Enter your credentials to access the dashboard</p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div>
              <label htmlFor="login-email" className="block text-body font-medium text-text-primary dark:text-dark-text mb-1.5">Email</label>
              <input id="login-email" {...register('email')} type="email" autoComplete="email" className={fieldClass(errors.email)} placeholder="you@company.com" />
              {errors.email && <p className="text-danger text-caption mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="login-password" className="block text-body font-medium text-text-primary dark:text-dark-text mb-1.5">Password</label>
              <input id="login-password" {...register('password')} type="password" autoComplete="current-password" className={fieldClass(errors.password)} placeholder="••••••••" />
              {errors.password && <p className="text-danger text-caption mt-1">{errors.password.message}</p>}
            </div>
            <button type="submit" disabled={submitting} className="w-full bg-primary text-white py-2.5 rounded-lg text-body font-medium hover:bg-primary-hover transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2">
              {submitting ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-body text-text-secondary dark:text-dark-text-secondary text-center mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-medium hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

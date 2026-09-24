import React from 'react';

const variants = {
  primary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 border border-indigo-500/30',
  secondary: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/60',
  outline: 'bg-transparent hover:bg-zinc-800/60 text-zinc-300 border border-zinc-700/80',
  ghost: 'bg-transparent hover:bg-zinc-800/80 text-zinc-400 hover:text-zinc-200',
  danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20 border border-rose-500/30'
};

const sizes = {
  sm: 'px-2.5 py-1.5 text-xs font-medium rounded-md',
  md: 'px-4 py-2 text-sm font-semibold rounded-lg',
  lg: 'px-5 py-2.5 text-base font-semibold rounded-xl'
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;

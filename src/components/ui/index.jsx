import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Button = ({ className, variant = 'primary', ...props }) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
  };
  
  return (
    <button 
      className={cn(variants[variant], className)} 
      {...props} 
    />
  );
};

export const Input = ({ className, label, error, ...props }) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && <label className="text-sm font-medium text-slate-300 ml-1">{label}</label>}
      <input 
        className={cn('input-field', error && 'border-rose-500 focus:ring-rose-500/20', className)} 
        {...props} 
      />
      {error && <p className="text-xs text-rose-500 ml-1 mt-1">{error}</p>}
    </div>
  );
};

export const Card = ({ className, children, glass = true, ...props }) => {
  return (
    <div 
      className={cn(
        glass && 'glass', 
        'rounded-2xl p-6 transition-all',
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

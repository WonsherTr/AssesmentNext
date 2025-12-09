'use client';

import React, { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-3 rounded-xl
            bg-white dark:bg-dark-card
            text-gray-900 dark:text-gray-100
            border-2
            transition-all duration-300
            focus:outline-none focus:border-primary-500
            disabled:bg-gray-100 dark:disabled:bg-dark-card/50 disabled:cursor-not-allowed disabled:opacity-60
            placeholder:text-gray-500
            ${error ? 'border-red-500/50' : 'border-gray-300 dark:border-dark-border hover:border-gray-400 dark:hover:border-dark-border/80'}
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        {helperText && !error && <p className="mt-2 text-sm text-gray-400">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full px-4 py-3 rounded-xl
            bg-white dark:bg-dark-card
            text-gray-900 dark:text-gray-100
            border-2
            transition-all duration-300
            focus:outline-none focus:border-primary-500
            disabled:bg-gray-100 dark:disabled:bg-dark-card/50 disabled:cursor-not-allowed disabled:opacity-60
            placeholder:text-gray-500
            min-h-[120px] resize-y
            ${error ? 'border-red-500/50' : 'border-gray-300 dark:border-dark-border hover:border-gray-400 dark:hover:border-dark-border/80'}
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        {helperText && !error && <p className="mt-2 text-sm text-gray-400">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`
            w-full px-4 py-3 rounded-xl
            bg-white dark:bg-dark-card
            text-gray-900 dark:text-gray-100
            border-2
            transition-all duration-300
            focus:outline-none focus:border-primary-500
            disabled:bg-gray-100 dark:disabled:bg-dark-card/50 disabled:cursor-not-allowed disabled:opacity-60
            ${error ? 'border-red-500/50' : 'border-gray-300 dark:border-dark-border hover:border-gray-400 dark:hover:border-dark-border/80'}
            ${className}
          `}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-dark-card">
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        {helperText && !error && <p className="mt-2 text-sm text-gray-400">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

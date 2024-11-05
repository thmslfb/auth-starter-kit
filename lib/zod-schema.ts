import { z } from 'zod';

const requiredString = z.string().min(1, 'This field is required');

const nameRegex = /^[a-zA-Z0-9 ]+$/;
const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*.])[A-Za-z\d!@#$%^&*.]{8,}$/;
const inputOTPRegex = /^[A-Z0-9]{6}$/;

export const signUpSchema = z
  .object({
    name: requiredString.regex(
      nameRegex,
      'Name can only contain letters, numbers, and spaces'
    ),
    email: requiredString.email('Invalid email address'),
    password: requiredString.regex(
      passwordRegex,
      'Password must be at least 8 characters long and contain at least one letter, one number, and one special character'
    ),
    confirmPassword: requiredString,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const inputOTPSchema = z.object({
  code: requiredString.regex(
    inputOTPRegex,
    'Please enter a valid 6-digit code'
  ),
});

export const signInSchema = z.object({
  email: requiredString.email('Invalid email address'),
  password: requiredString,
});

export const forgotPasswordSchema = z.object({
  email: requiredString.email('Invalid email address'),
});

export const resetPasswordSchema = z
  .object({
    password: requiredString.regex(
      passwordRegex,
      'Password must be at least 8 characters long and contain at least one letter, one number, and one special character'
    ),
    confirmPassword: requiredString,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

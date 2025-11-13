'use client';
import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) return;
    axios
      .get(`/api/auth/verify-email?token=${token}`)
      .then(() => {
        toast.success('Email verified successfully!');
        router.push('/auth/login');
      })
      .catch(err => {
        toast.error(err.response?.data?.error || 'Verification failed.');
      });
  }, [token, router]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
      <Toaster position="top-right" />
      <p className="text-gray-700 dark:text-gray-200">Verifying your email...</p>
    </div>
  );
}

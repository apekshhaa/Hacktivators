import React from 'react';
import Button from '../../components/common/Button';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <div className="p-8 bg-white rounded shadow-md w-96 text-center">
        <h1 className="text-2xl font-bold text-green-700 mb-6">Swasthya Parivar</h1>
        <form>
          <input className="w-full border p-2 mb-4 rounded" type="text" placeholder="Phone Number" />
          <input className="w-full border p-2 mb-6 rounded" type="password" placeholder="Password (or OTP)" />
          <Button className="w-full bg-green-600 hover:bg-green-700">Login</Button>
        </form>
      </div>
    </div>
  );
}
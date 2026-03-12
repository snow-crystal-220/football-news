import React from 'react';
import HomePage from '@/pages/HomePage';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <HomePage />
      </main>
      <Footer />
    </div>
  );
}

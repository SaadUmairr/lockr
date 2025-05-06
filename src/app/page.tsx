import { Footer } from '@/components/footer';
import { Homepage } from '@/components/homepage';
import { Navbar } from '@/components/navbar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'lockr | Secure Password Manager',
  description: 'A zero-knowledge, end-to-end encrypted password manager that keeps your data private and secure.',
  keywords: 'password manager, security, encryption, zero knowledge, privacy',
};

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-50">
      {/* These components will be client-side rendered */}
      <Navbar />
      <Homepage />
      <Footer />
    </div>
  );
}
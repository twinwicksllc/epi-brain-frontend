'use client';

import { Brain } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-[#1a0a2e] border-b border-[#7B3FF2]/20 px-6 py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#7B3FF2] to-[#A78BFA] rounded-full flex items-center justify-center">
            <Brain className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-bold text-white">EPI Brain</h1>
        </Link>
      </div>
    </header>
  );
}
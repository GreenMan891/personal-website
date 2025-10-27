'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function FadeLink({ href, children }: { href: string; children: React.ReactNode }) {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsTransitioning(true);

    document.body.classList.add('fade-out');

    setTimeout(() => {
      router.push(href);
      setTimeout(() => {
        document.body.classList.remove('fade-out');
      }, 500);
    }, 500);
  };

  return (
    <Link href={href} onClick={handleClick}>
      {children}
    </Link>
  );
}
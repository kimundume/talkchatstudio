'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { useState } from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  href?: string;
  className?: string;
}

const sizeMap = {
  sm: { icon: 24, text: 'text-lg' },
  md: { icon: 32, text: 'text-xl' },
  lg: { icon: 40, text: 'text-2xl' },
  xl: { icon: 48, text: 'text-3xl' },
};

export function Logo({ size = 'md', showText = true, href = '/', className = '' }: LogoProps) {
  const { icon, text } = sizeMap[size];
  const [imageError, setImageError] = useState(false);

  const content = (
    <div className={`flex items-center gap-2 ${className}`}>
      {imageError ? (
        <div 
          className="shrink-0 rounded-full bg-primary flex items-center justify-center text-primary-foreground"
          style={{ width: icon, height: icon }}
        >
          <MessageCircle size={icon * 0.6} />
        </div>
      ) : (
        <Image
          src="/logo.svg"
          alt="TalkChat Studio"
          width={icon}
          height={icon}
          className="shrink-0"
          priority
          onError={() => setImageError(true)}
        />
      )}
      {showText && (
        <span className={`font-bold ${text} bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent`}>
          TalkChat Studio
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center transition-opacity hover:opacity-80">
        {content}
      </Link>
    );
  }

  return content;
}

export default Logo;

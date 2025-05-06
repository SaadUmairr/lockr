'use client';

import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Github from '../../public/github.svg';

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  external?: boolean;
};

const FooterLink: React.FC<NavLinkProps> = ({ href, children, external = false }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <a
      href={href}
      className={`${isDark ? 'text-slate-400 hover:text-slate-100' : 'text-slate-600 hover:text-slate-900'} transition duration-300`}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      <motion.span
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        className="flex items-center space-x-1"
      >
        {children}
      </motion.span>
    </a>
  );
};

const Footer: React.FC = () => {
  const currentYear = new Date().getUTCFullYear();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <footer className={`${isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'} border-t py-8`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.div
            className="flex items-center space-x-2 mb-4 md:mb-0"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Image src="/key96.svg" alt="KEY" width={24} height={24} />
            <span className={`text-lg font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>lockr</span>
          </motion.div>
          
          <div className="flex space-x-6 mb-4 md:mb-0">
            <FooterLink href="#features">Features</FooterLink>
            <FooterLink href="#privacy">Privacy</FooterLink>
            <FooterLink href="#tos">Terms of Service</FooterLink>
          </div>
          
          <div className="flex space-x-4">
            <FooterLink href="https://github.com/saadumairr/lockr" external>
              <Image src={Github} alt="Github" height={18} width={18} />
            </FooterLink>
          </div>
        </div>
        
        <hr className={`${isDark ? 'border-slate-800' : 'border-slate-200'} my-6`} />
        
        <div className={`text-center ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          <p>A zero-knowledge, open-source project.</p>
          <p className="mt-2">&copy; {currentYear} lockr - No tracking, no ads, just secure password storage.</p>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
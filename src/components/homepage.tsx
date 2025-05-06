'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Eye, Key, Lock, ShieldCheck } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Github from '../../public/github.svg';

type FeatureCardProps = {
  icon: React.FC<{ size?: number; className?: string }>;
  title: string;
  description: string;
};

// Feature Card Component
const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.div 
      className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border p-6 rounded-lg shadow-md`}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-center mb-4">
        <Icon size={36} className="text-sky-400" />
      </div>
      <h3 className={`text-lg font-semibold mb-2 text-center ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{title}</h3>
      <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'} text-center`}>{description}</p>
    </motion.div>
  );
};

// Main Homepage Component
export const Homepage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <main className={`flex-grow ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* Hero */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <motion.div 
              className="md:w-1/2 mb-10 md:mb-0"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-slate-50' : 'text-slate-900'}`}>
                Secure your digital keys with <span className="text-sky-400">zero knowledge</span>
              </h1>
              <p className={`text-xl md:text-2xl font-light mb-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Where privacy meets simplicity.
              </p>
              <p className={`text-md mb-8 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                An open-source password manager that encrypts your data locally with end-to-end encryption.
                Your master passphrase never leaves your device.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <motion.a 
                  href="/login" 
                  className="bg-sky-700 hover:bg-sky-500 text-white py-3 px-6 rounded-lg font-medium text-center transition duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                </motion.a>
                <motion.a 
                  href="https://github.com/saadumairr/lockr" 
                  className={`${isDark ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200' : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'} border py-3 px-6 rounded-lg font-medium flex items-center justify-center space-x-2 transition duration-300`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Image src={Github} alt="Github" height={18} width={18} className='bg-black rounded-full dark:bg-transparent' />
                  <span>View on GitHub</span>
                </motion.a>
              </div>
            </motion.div>
            
            <motion.div 
              className="md:w-5/12"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'} border p-6 rounded-lg shadow-xl`}>
                <div className="flex justify-center mb-8">
                  <motion.div 
                    className="relative"
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{ 
                      repeat: Infinity,
                      repeatType: "reverse",
                      duration: 4
                    }}
                  >
                    <Lock size={80} className="text-sky-400" />
                    <div className="absolute -top-2 -right-2 bg-sky-500 rounded-full w-6 h-6 flex items-center justify-center">
                      <ShieldCheck size={16} className="text-white" />
                    </div>
                  </motion.div>
                </div>
                <motion.div 
                  className="space-y-4"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.3
                      }
                    }
                  }}
                  initial="hidden"
                  animate="show"
                >
                  <motion.div 
                    className={`${isDark ? 'bg-slate-700' : 'bg-slate-200'} p-4 rounded-md`}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 }
                    }}
                  >
                    <div className="flex justify-between mb-2">
                      <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Example Service</span>
                      <Eye size={18} className={isDark ? 'text-slate-400' : 'text-slate-600'} />
                    </div>
                    <div className={`${isDark ? 'bg-slate-800' : 'bg-slate-300'} p-2 rounded-md ${isDark ? 'text-slate-300' : 'text-slate-700'} font-mono`}>
                      ••••••••••••••••
                    </div>
                  </motion.div>
                  <motion.div 
                    className={`${isDark ? 'bg-slate-700' : 'bg-slate-200'} p-4 rounded-md`}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 }
                    }}
                  >
                    <div className="flex justify-between mb-2">
                      <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Your Master Key</span>
                      <Key size={18} className="text-sky-400" />
                    </div>
                    <div className={`${isDark ? 'bg-slate-800' : 'bg-slate-300'} p-2 rounded-md text-sky-400 font-mono`}>
                      Only you know this
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className={`py-16 ${isDark ? 'bg-slate-900' : 'bg-white'} px-4`}>
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className={"text-3xl font-bold mb-4 dark:text-slate-100 text-slate-900"}>
              Security by Design
            </h2>
            <p className={" text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"}>
              lockr was built from the ground up with your privacy in mind.
              We believe security shouldn&apos;t come at the cost of convenience.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={ShieldCheck}
              title="End-to-End Encryption"
              description="All your sensitive data is encrypted locally on your device before it reaches our servers."
            />
            <FeatureCard 
              icon={Eye}
              title="Zero Knowledge Architecture"
              description="We can't see your passwords. Your master key never leaves your device, so only you can decrypt your data."
            />
            <FeatureCard 
              icon={ExternalLink}
              title="Open Source Transparency"
              description="Our code is fully transparent. Anyone can verify our security practices and contribute improvements."
            />
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className={`py-16 px-4 ${isDark ? 'bg-slate-950' : 'bg-slate-100'}`}>
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              How lockr Works
            </h2>
            <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} max-w-2xl mx-auto`}>
              Simple for you, complex for attackers.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'} border p-4 rounded-lg`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex justify-center mb-4">
                <div className={`${isDark ? 'bg-slate-700' : 'bg-slate-200'} w-12 h-12 rounded-full flex items-center justify-center`}>
                  <span className="text-sky-400 font-bold">1</span>
                </div>
              </div>
              <h3 className={`text-lg font-medium mb-2 text-center ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Create Master Key</h3>
              <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-center text-sm`}>
                Set up your personal passphrase that will be used to encrypt all your data.
              </p>
            </motion.div>
            
            <motion.div
              className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'} border p-4 rounded-lg`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex justify-center mb-4">
                <div className={`${isDark ? 'bg-slate-700' : 'bg-slate-200'} w-12 h-12 rounded-full flex items-center justify-center`}>
                  <span className="text-sky-400 font-bold">2</span>
                </div>
              </div>
              <h3 className={`text-lg font-medium mb-2 text-center ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Add Passwords</h3>
              <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-center text-sm`}>
                Store your login credentials securely with end-to-end encryption.
              </p>
            </motion.div>
            
            <motion.div
              className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'} border p-4 rounded-lg`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex justify-center mb-4">
                <div className={`${isDark ? 'bg-slate-700' : 'bg-slate-200'} w-12 h-12 rounded-full flex items-center justify-center`}>
                  <span className="text-sky-400 font-bold">3</span>
                </div>
              </div>
              <h3 className={`text-lg font-medium mb-2 text-center ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Local Encryption</h3>
              <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-center text-sm`}>
                Everything is encrypted on your device before being stored.
              </p>
            </motion.div>
            
            <motion.div
              className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'} border p-4 rounded-lg`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex justify-center mb-4">
                <div className={`${isDark ? 'bg-slate-700' : 'bg-slate-200'} w-12 h-12 rounded-full flex items-center justify-center`}>
                  <span className="text-sky-400 font-bold">4</span>
                </div>
              </div>
              <h3 className={`text-lg font-medium mb-2 text-center ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Access Anywhere</h3>
              <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-center text-sm`}>
                Securely access your passwords across all your devices.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className={`py-16 px-4 ${isDark ? 'bg-gradient-to-b from-slate-900 to-slate-950' : 'bg-gradient-to-b from-slate-100 to-white'}`}>
        <div className="container mx-auto max-w-4xl">
          <motion.div
            className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'} border rounded-xl p-8 text-center shadow-xl`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              Ready to secure your Credentials?
            </h2>
            <p className={`${isDark ? 'text-slate-300' : 'text-slate-700'} mb-8`}>
              It takes less than a minute to start protecting your passwords with lockr.
            </p>
            <motion.a 
              href="/login" 
              className="bg-sky-700 hover:bg-sky-500 text-white py-3 px-8 rounded-lg font-medium text-center inline-block transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Secure My Credentials
            </motion.a>
          </motion.div>
        </div>
      </section>
    </main>
  );
};
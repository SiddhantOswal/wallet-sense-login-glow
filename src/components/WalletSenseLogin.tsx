import { motion } from 'framer-motion';
import { useState } from 'react';
import googleIcon from '@/assets/google-icon.png';

// Ripple Animation Component
const RippleBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="ripple-container">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="ripple-circle"
            style={{
              width: `${200 + i * 100}px`,
              height: `${200 + i * 100}px`,
              left: '50%',
              top: '50%',
              animationDelay: `${i * 0.5}s`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0.8, 1.2, 0.8], 
              opacity: [0.1, 0.3, 0.1] 
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* Floating AI Icons */}
      <motion.div
        className="absolute top-20 left-20 w-16 h-16 bg-wallet-primary/10 rounded-full flex items-center justify-center"
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 180, 360]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-8 h-8 bg-gradient-primary rounded-lg animate-glow" />
      </motion.div>
      
      <motion.div
        className="absolute top-32 right-32 w-12 h-12 bg-wallet-secondary/10 rounded-full flex items-center justify-center"
        animate={{ 
          y: [0, 20, 0],
          x: [0, -10, 0]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      >
        <div className="w-6 h-6 bg-wallet-secondary rounded-full animate-pulse" />
      </motion.div>
      
      <motion.div
        className="absolute bottom-32 left-1/4 w-20 h-20 bg-wallet-accent/20 rounded-2xl flex items-center justify-center"
        animate={{ 
          rotate: [0, 90, 180, 270, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className="w-10 h-10 bg-gradient-primary rounded-xl animate-float" />
      </motion.div>
    </div>
  );
};

// Box Reveal Animation Component
const BoxReveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  );
};

// Google Sign In Button Component
const GoogleSignInButton = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleGoogleSignIn = () => {
    // Handle Google OAuth here
    console.log('Google Sign In clicked');
  };

  return (
    <motion.button
      className="google-button group w-full max-w-sm"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleGoogleSignIn}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-center gap-3">
        <img 
          src={googleIcon} 
          alt="Google" 
          className="w-5 h-5"
        />
        <span className="text-foreground font-medium">
          Sign in with Google
        </span>
      </div>
      
      {/* Animated border glow */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300"
        animate={isHovered ? { scale: [1, 1.05, 1] } : { scale: 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
    </motion.button>
  );
};

// Main Login Component
const WalletSenseLogin = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <RippleBackground />
      
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center max-w-md mx-auto px-6">
        {/* Glass Card Container */}
        <motion.div 
          className="glass-card rounded-3xl p-8 w-full text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Brand Logo */}
          <BoxReveal delay={0.2}>
            <motion.div 
              className="mb-2"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent bg-[length:200%_200%]">
                WalletSense
              </h1>
            </motion.div>
          </BoxReveal>

          {/* Tagline */}
          <BoxReveal delay={0.4}>
            <p className="text-muted-foreground text-lg mb-8 font-medium">
              Let AI speak to your money
            </p>
          </BoxReveal>

          {/* Sign In Button */}
          <BoxReveal delay={0.6}>
            <div className="mb-8">
              <GoogleSignInButton />
            </div>
          </BoxReveal>

          {/* Footer Text */}
          <BoxReveal delay={0.8}>
            <motion.p 
              className="text-sm text-muted-foreground/80"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Secure. Private. Built with Google AI
            </motion.p>
          </BoxReveal>
        </motion.div>

        {/* Additional floating elements */}
        <motion.div 
          className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-glow rounded-full opacity-30 blur-xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute -bottom-20 -left-20 w-32 h-32 bg-wallet-secondary/20 rounded-full opacity-40 blur-xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>
    </div>
  );
};

export default WalletSenseLogin;
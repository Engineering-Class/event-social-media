import React from 'react';
import { motion } from 'framer-motion';
import { Box } from '@mui/material';

interface ExplosionAnimationProps {
  onComplete: () => void;
}

const particles = Array.from({ length: 20 });

const ExplosionAnimation: React.FC<ExplosionAnimationProps> = ({ onComplete }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1300,
      }}
    >
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1 }}
        onAnimationComplete={onComplete}
        style={{ position: 'relative', width: 100, height: 100 }}
      >
        {particles.map((_, index) => {
          const x = Math.random() * 200 - 100;
          const y = Math.random() * 200 - 100;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1, x, y }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
              }}
            />
          );
        })}
      </motion.div>
    </Box>
  );
};

export default ExplosionAnimation;

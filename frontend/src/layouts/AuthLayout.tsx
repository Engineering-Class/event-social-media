// src/layouts/AuthLayout.tsx
import React from 'react';
import { Box } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import Particles from 'react-tsparticles';
import { Engine } from 'tsparticles-engine';
import { loadSeaAnemonePreset } from 'tsparticles-preset-sea-anemone';
import { AnimatePresence, motion } from 'framer-motion';

const AuthLayout: React.FC = () => {
  const particlesInit = async (engine: Engine): Promise<void> => {
    await loadSeaAnemonePreset(engine);
  };

  const location = useLocation();

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Box
        sx={{
          flex: 1,
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{
              width: '100%',
              position: 'absolute',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </Box>
      <Box
        sx={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#000',
        }}
      >
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{ preset: 'seaAnemone' }}
          style={{
            position: 'fixed',
            width: '100%',
            height: '100%',
            zIndex: 0,
          }}
        />
      </Box>
    </Box>
  );
};

export default AuthLayout;

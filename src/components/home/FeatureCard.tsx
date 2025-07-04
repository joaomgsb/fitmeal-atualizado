import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <motion.div 
      className="bg-white p-6 rounded-xl border border-neutral-200 shadow-card hover:shadow-card-hover transition-shadow group"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="w-12 h-12 bg-primary-50 rounded-md flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
        <div className="text-primary-500">{icon}</div>
      </div>
      <h3 className="text-xl font-semibold mb-3 text-neutral-800">{title}</h3>
      <p className="text-neutral-600">{description}</p>
    </motion.div>
  );
};

export default FeatureCard;
import React from 'react';
import { Link } from 'react-router-dom';
import { FiInbox } from 'react-icons/fi';

const EmptyState = ({
  title = 'No Results Found',
  description = 'We couldn\'t find what you were looking for. Please try adjusting your parameters.',
  buttonText,
  buttonLink,
  icon: CustomIcon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 glass-card rounded-3xl max-w-xl mx-auto my-8">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 animate-bounce">
        {CustomIcon ? <CustomIcon className="text-3xl" /> : <FiInbox className="text-3xl" />}
      </div>
      <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-8 leading-relaxed">{description}</p>
      
      {buttonText && buttonLink && (
        <Link
          to={buttonLink}
          className="bg-primary hover:bg-primary-hover text-white font-semibold text-sm px-6 py-2.5 rounded-full transition-all shadow-md shadow-primary/15"
        >
          {buttonText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;

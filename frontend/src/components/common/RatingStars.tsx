import React from 'react';

interface RatingStarsProps {
  rating: number;
  max?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

const RatingStars: React.FC<RatingStarsProps> = ({ 
  rating, 
  max = 5, 
  interactive = false, 
  onRatingChange,
  size = 'md'
}) => {
  const stars = Array.from({ length: max }, (_, i) => i + 1);

  const getFontSize = () => {
    switch(size) {
      case 'sm': return 16;
      case 'lg': return 32;
      default: return 24;
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {stars.map((star) => (
        <span
          key={star}
          onClick={() => interactive && onRatingChange && onRatingChange(star)}
          className={interactive ? 'cursor-pointer transition-transform hover:scale-110' : ''}
        >
          {star <= rating ? (
            <StarIcon style={{ fontSize: getFontSize(), color: 'var(--color-accent)' }} />
          ) : (
            <StarBorderIcon style={{ fontSize: getFontSize(), color: 'var(--color-border)' }} />
          )}
        </span>
      ))}
    </div>
  );
};

export default RatingStars;

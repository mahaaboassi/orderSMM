import { useState } from "react";

const ReviewStars = ({returnedValue}) => {
  const [rating, setRating] = useState(1); 
  const [hover, setHover] = useState(0);   

  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex gap-1">
      {stars.map((star, idx) => (
        <div
          key={`Star_${idx}`}
          className="cursor-pointer"
          onClick={() => {
            setRating(star)
            returnedValue(star)
          }}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
        >
          {(hover >= star || rating >= star) ? (
            // filled star
            <svg xmlns="http://www.w3.org/2000/svg" width="27" height="26" viewBox="0 0 19 18" fill="none">
              <path d="M9.96 0.307L12.39 5.949L18.55 6.496C18.82 6.52 19.02 6.758 18.99 7.029C18.964 7.213 18.91 7.297 18.836 7.36L14.17 11.403L15.55 17.398C15.61 17.663 15.44 17.927 15.18 17.988C15.04 18.019 14.9 17.991 14.79 17.92L9.5 14.775L4.19 17.93C3.95 18.069 3.65 17.993 3.51 17.76C3.44 17.647 3.43 17.518 3.45 17.399L4.83 11.405L0.17 7.361C-0.03 7.183 -0.05 6.873 0.12 6.668C0.21 6.565 0.34 6.508 0.47 6.502L6.61 5.954L9.04 0.3C9.15 0.05 9.44 -0.067 9.69 0.04C9.82 0.092 9.91 0.188 9.96 0.303Z" fill="#FFD401"/>
            </svg>
          ) : (
            // outlined star
            <svg xmlns="http://www.w3.org/2000/svg" width="27" height="26" viewBox="0 0 19 18" fill="none">
              <path d="M9.95 0.303L12.39 5.954L18.55 6.503C18.82 6.526 19.02 6.764 18.99 7.034C18.96 7.213 18.91 7.297 18.83 7.361L14.17 11.405L15.55 17.399C15.61 17.663 15.44 17.927 15.18 17.988C15.04 18.019 14.9 17.991 14.79 17.92L9.5 14.775L4.19 17.93C3.95 18.069 3.65 17.993 3.51 17.76C3.44 17.647 3.43 17.518 3.45 17.399L4.83 11.405L0.17 7.361C-0.03 7.183 -0.05 6.873 0.12 6.668C0.21 6.565 0.34 6.508 0.47 6.502L6.61 5.954L9.04 0.3C9.15 0.05 9.44 -0.067 9.69 0.04C9.82 0.092 9.91 0.188 9.95 0.303Z" fill="#E0E0E0"/>
            </svg>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewStars;

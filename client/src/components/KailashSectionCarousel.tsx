import { useState, useEffect } from "react";

const kailashImages = [
  {
    src: "/images/kailash-section/Mountain sacred Lake Manasarovar Himalayas range Tibet.avif",
    alt: "Sacred Lake Manasarovar in the Himalayas, Tibet",
  },
  {
    src: "/images/kailash-section/lake Manasarovar.avif",
    alt: "Lake Manasarovar - Holy Waters",
  },
  {
    src: "/images/kailash-section/kedarnath-1.avif",
    alt: "Kedarnath Temple - Sacred Himalayan Shrine",
  },
  {
    src: "/images/kailash-section/jyotirlinga-tour.jpg",
    alt: "Jyotirlinga Temple - Divine Pilgrimage",
  },
  {
    src: "/images/kailash-section/ganga aarti -1.avif",
    alt: "Ganga Aarti - Sacred River Ceremony",
  },
  {
    src: "/images/kailash-section/hampi-1.avif",
    alt: "Hampi - Ancient Temple Architecture",
  },
];

export function KailashSectionCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % kailashImages.length);
        setIsTransitioning(false);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative rounded-lg overflow-hidden shadow-xl aspect-[4/3]">
      {kailashImages.map((image, index) => (
        <div
          key={image.src}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentIndex && !isTransitioning
              ? "opacity-100"
              : "opacity-0"
          }`}
        >
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-full object-cover"
            loading={index === 0 ? "eager" : "lazy"}
          />
        </div>
      ))}

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {kailashImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-white w-6"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";

const heroImages = [
  {
    src: "/images/hero/kailash-manasarovar-hero.jpg",
    alt: "Mount Kailash Manasarovar - The Sacred Abode of Lord Shiva",
  },
  {
    src: "/images/hero/kailash-manasarovar-hero-4.jpeg",
    alt: "Kailash Manasarovar Lake - Divine Waters",
  },
  {
    src: "/images/hero/kailash-manasarovar-hero-2.jpg",
    alt: "Kailash Manasarovar Journey - Spiritual Trek",
  },
  {
    src: "/images/hero/on-the-way-kailash.avif",
    alt: "On the way to Mount Kailash",
  },
  {
    src: "/images/hero/adi-kailash-trek01.webp",
    alt: "Adi Kailash & Om Parvat - Himalayan Sacred Mountains",
  },
  {
    src: "/images/hero/kailash-2.avif",
    alt: "Mount Kailash - Sacred Peak in the Himalayas",
  },
];

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
        setIsTransitioning(false);
      }, 500); // Fade duration
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 z-0">
      {heroImages.map((image, index) => (
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
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70" />

      {/* Slide indicators */}
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

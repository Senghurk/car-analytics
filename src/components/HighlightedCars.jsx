import React, { useState, useEffect } from 'react';
import carData from '../data/taladrod-cars.min.json';
import styles from './HighlightedCars.module.css';
import { Button } from '@mui/material';

function HighlightedCars() {
  const [highlightedCars, setHighlightedCars] = useState([]);

  useEffect(() => {
    const storedHighlightedCars = JSON.parse(localStorage.getItem('highlightedCars')) || [];
    setHighlightedCars(storedHighlightedCars);
  }, []);

  const toggleHighlight = (carId) => {
    setHighlightedCars(prev => {
      const newHighlightedCars = prev.includes(carId)
        ? prev.filter(id => id !== carId)
        : [...prev, carId];
      
      localStorage.setItem('highlightedCars', JSON.stringify(newHighlightedCars));
      return newHighlightedCars;
    });
  };

  // Separate highlighted cars for display
  const highlightedCarsList = carData.Cars.filter(car => highlightedCars.includes(car.Cid));

  const CarCard = ({ car, isHighlighted }) => (
    <div className={styles.carCard}>
      <img src={car.Img600} alt={`${car.Model} image`} className={styles.carImage} />
      <div className={styles.carDetails}>
        <h3 className={styles.carBrand}>{car.Model}, {car.Province}</h3>
        <p className={styles.carModel}>{car.NameMMT}</p>
        <p className={styles.carPrice}>Price: {car.Prc} {car.Currency}</p>
        <Button onClick={() => toggleHighlight(car.Cid)} className={styles.favoriteButton} style={{ minWidth: 'auto' }}>
          {isHighlighted ? '❤️' : '🤍'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className={styles.pageContainer}>
      {/* Highlighted Cars Section */}
      {highlightedCarsList.length > 0 && (
        <div className={styles.highlightedSection}>
          <h2>Highlighted Cars</h2>
          <div className={styles.carList}>
            {highlightedCarsList.map(car => (
              <CarCard key={car.Cid} car={car} isHighlighted={true} />
            ))}
          </div>
        </div>
      )}

      {/* All Cars Section */}
      <div className={styles.allCarsSection}>
        <h1>All Cars</h1>
        <div className={styles.carList}>
          {carData.Cars.map(car => (
            <CarCard 
              key={car.Cid} 
              car={car} 
              isHighlighted={highlightedCars.includes(car.Cid)} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HighlightedCars;
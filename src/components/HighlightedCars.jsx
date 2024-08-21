import React, { useState, useEffect } from 'react';
import carData from '../data/taladrod-cars.min.json';
import styles from './HighlightedCars.module.css';

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

  return (
    <div className={styles.pageContainer}>
      {/* Highlighted Cars Section */}
      {highlightedCarsList.length > 0 && (
        <div className={styles.highlightedSection}>
          <h2>Highlighted Cars</h2>
          <div className={styles.highlightedCarsList}>
            {highlightedCarsList.map(car => (
              <div key={car.Cid} className={styles.carItem}>
                <img src={car.Img600} alt={`${car.Model} image`} className={styles.carImage} />
                <span>{car.Model} - {car.NameMMT}</span>
                <button 
                  onClick={() => toggleHighlight(car.Cid)}
                  className={highlightedCars.includes(car.Cid) ? styles.highlighted : ''}
                >
                  Remove Highlight
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Cars Section */}
      <div className={styles.highlightedCars}>
        <h1>All Cars</h1>
        <div className={styles.carList}>
          {carData.Cars.map(car => (
            <div key={car.Cid} className={styles.carItem}>
              <img src={car.Img600} alt={`${car.Model} image`} className={styles.carImage} />
              <span>{car.Model} - {car.NameMMT}</span>
              <button 
                onClick={() => toggleHighlight(car.Cid)}
                className={highlightedCars.includes(car.Cid) ? styles.highlighted : ''}
              >
                {highlightedCars.includes(car.Cid) ? 'Remove Highlight' : 'Highlight'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HighlightedCars;

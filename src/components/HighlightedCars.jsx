import React, { useState, useEffect } from 'react';
import carData from '../data/taladrod-cars.min.json';

function HighlightedCars() {
  const [highlightedCars, setHighlightedCars] = useState([]);
  const [availableCars, setAvailableCars] = useState([]);

  useEffect(() => {
    const storedHighlightedCars = JSON.parse(localStorage.getItem('highlightedCars')) || [];
    setHighlightedCars(storedHighlightedCars);
    setAvailableCars(carData.Cars.filter(car => !storedHighlightedCars.includes(car.Cid)));
  }, []);

  const addHighlightedCar = (car) => {
    const updatedHighlightedCars = [...highlightedCars, car.Cid];
    setHighlightedCars(updatedHighlightedCars);
    setAvailableCars(availableCars.filter(c => c.Cid !== car.Cid));
    localStorage.setItem('highlightedCars', JSON.stringify(updatedHighlightedCars));
  };

  const removeHighlightedCar = (car) => {
    const updatedHighlightedCars = highlightedCars.filter(cid => cid !== car.Cid);
    setHighlightedCars(updatedHighlightedCars);
    setAvailableCars([...availableCars, car]);
    localStorage.setItem('highlightedCars', JSON.stringify(updatedHighlightedCars));
  };

  return (
    <div>
      <h1>Highlighted Cars</h1>
      <div>
        <h2>Highlighted</h2>
        <ul>
          {carData.Cars.filter(car => highlightedCars.includes(car.Cid)).map(car => (
            <li key={car.Cid}>
              {car.Model} - {car.NameMMT} - {car.Prc}
              <button onClick={() => removeHighlightedCar(car)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Available Cars</h2>
        <ul>
          {availableCars.map(car => (
            <li key={car.Cid}>
              {car.Model} - {car.NameMMT} - {car.Prc}
              <button onClick={() => addHighlightedCar(car)}>Add</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default HighlightedCars;
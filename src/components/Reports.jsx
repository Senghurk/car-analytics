import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import carData from '../data/taladrod-cars.min.json';
import styles from './Reports.module.css';

function Reports() {
  const [carPrices, setCarPrices] = useState([]);

  useEffect(() => {
    const prices = carData.Cars.map(car => parseInt(car.Prc.replace(/,/g, ''), 10));
    setCarPrices(prices);
  }, []);

  const priceRangeData = {
    labels: ['0-500,000 Baht', '500,000-1,000,000 Baht', '1,000,000-1,500,000 Baht', '1,500,000+ Baht'],
    datasets: [
      {
        data: [
          carPrices.filter(price => price <= 500000).length,
          carPrices.filter(price => price > 500000 && price <= 1000000).length,
          carPrices.filter(price => price > 1000000 && price <= 1500000).length,
          carPrices.filter(price => price > 1500000).length,
        ],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  return (
    <div className={styles.reports}>
      <h1>Car Price Distribution</h1>
      <div className={styles.chartContainer}>
        <Pie data={priceRangeData} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </div>
  );
}

export default Reports;

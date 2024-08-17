import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import carData from '../data/taladrod-cars.min.json';
import styles from './Dashboard.module.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function Dashboard() {
  const [brandData, setBrandData] = useState({});
  const [modelData, setModelData] = useState({});

  useEffect(() => {
    // Process car data
    const brands = {};
    const models = {};

    carData.Cars.forEach(car => {
      if (!brands[car.MkID]) {
        brands[car.MkID] = { count: 0, value: 0, name: car.Model };
      }
      brands[car.MkID].count++;
      brands[car.MkID].value += parseInt(car.Prc.replace(/,/g, ''), 10);

      if (!models[car.MkID]) {
        models[car.MkID] = {};
      }
      if (!models[car.MkID][car.MdID]) {
        models[car.MkID][car.MdID] = { count: 0, name: car.NameMMT };
      }
      models[car.MkID][car.MdID].count++;
    });

    setBrandData(brands);
    setModelData(models);
  }, []);

  const pieChartData = {
    labels: Object.values(brandData).map(brand => brand.name),
    datasets: [
      {
        data: Object.values(brandData).map(brand => brand.count),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
        ],
      },
    ],
  };

  const barChartData = {
    labels: Object.keys(modelData).map(brandId => brandData[brandId].name),
    datasets: [{
      label: 'Number of Models',
      data: Object.keys(modelData).map(brandId => Object.keys(modelData[brandId]).length),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    }],
  };

  const barChartOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Car Market Dashboard</h1>
      
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Brand</th>
              <th>Model</th>
              <th>Count</th>
              <th>Value (Baht)</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(brandData).map(([brandId, brand]) => (
              <React.Fragment key={brandId}>
                <tr className={styles.brandRow}>
                  <td>{brand.name}</td>
                  <td>-</td>
                  <td>{brand.count}</td>
                  <td>{brand.value.toLocaleString()}</td>
                </tr>
                {Object.values(modelData[brandId]).map(model => (
                  <tr key={`${brandId}-${model.name}`} className={styles.modelRow}>
                    <td>-</td>
                    <td>{model.name}</td>
                    <td>{model.count}</td>
                    <td>-</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.chartsContainer}>
        <div className={styles.chartWrapper}>
          <h2>Cars by Brand</h2>
          <div className={styles.pieChart}>
            <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        <div className={styles.chartWrapper}>
          <h2>Models by Brand</h2>
          <div className={styles.barChart}>
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
import React, { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PieController,
  BarController
} from 'chart.js';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import carData from '../data/taladrod-cars.min.json';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PieController,
  BarController
);

const Dashboard = () => {
  const [brandData, setBrandData] = useState({});
  const [expandedBrands, setExpandedBrands] = useState({});
  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);

  useEffect(() => {
    const processedData = {};

    carData.Cars.forEach(car => {
      if (!processedData[car.MkID]) {
        processedData[car.MkID] = {
          name: car.Model,
          count: 0,
          value: 0,
          models: {}
        };
      }

      processedData[car.MkID].count++;
      processedData[car.MkID].value += parseInt(car.Prc.replace(/,/g, ''), 10);

      if (!processedData[car.MkID].models[car.MdID]) {
        processedData[car.MkID].models[car.MdID] = {
          name: car.NameMMT,
          count: 0,
          value: 0
        };
      }

      processedData[car.MkID].models[car.MdID].count++;
      processedData[car.MkID].models[car.MdID].value += parseInt(car.Prc.replace(/,/g, ''), 10);
    });

    setBrandData(processedData);
  }, []);

  useEffect(() => {
    if (Object.keys(brandData).length > 0) {
      renderCharts();
    }
  }, [brandData]);

  const toggleBrand = (brandId) => {
    setExpandedBrands(prev => ({
      ...prev,
      [brandId]: !prev[brandId]
    }));
  };

  const renderCharts = () => {
    const brands = Object.values(brandData);
    const colors = generateColors(brands.length);

    if (pieChartRef.current) {
      new ChartJS(pieChartRef.current, {
        type: 'pie',
        data: {
          labels: brands.map(brand => brand.name),
          datasets: [{
            data: brands.map(brand => brand.count),
            backgroundColor: colors,
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
            },
            title: {
              display: true,
              text: 'Cars by Brand',
              align: 'center',
              font: {
                size: 20,
                weight: 'bold'
              },
              padding: {
                top: 10,
                bottom: 30
              }
            }
          }
        }
      });
    }

    if (barChartRef.current) {
      new ChartJS(barChartRef.current, {
        type: 'bar',
        data: {
          labels: brands.map(brand => brand.name),
          datasets: brands.flatMap(brand =>
            Object.values(brand.models).map(model => ({
              label: model.name,
              data: brands.map(b => b.name === brand.name ? model.count : 0),
              backgroundColor: colors[brands.indexOf(brand)],
            }))
          )
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              stacked: true,
            },
            y: {
              stacked: true,
              beginAtZero: true,
            }
          },
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: 'Models by Brand',
              align: 'center',
              font: {
                size: 20,
                weight: 'bold'
              },
              padding: {
                top: 10,
                bottom: 30
              }
            }
          }
        }
      });
    }
  };


  const generateColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(`hsl(${(i * 360) / count}, 70%, 50%)`);
    }
    return colors;
  };

  return (
    <div style={{ padding: '16px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Car Market Dashboard</h1>

      {Object.keys(brandData).length === 0 ? (
        <div>Loading data...</div>
      ) : (
        <>
          <div style={{ marginBottom: '32px' }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Brand/Model</TableCell>
                    <TableCell align="right">Number</TableCell>
                    <TableCell align="right">Value (THB)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(brandData).map(([brandId, brand]) => (
                    <React.Fragment key={brandId}>
                      <TableRow onClick={() => toggleBrand(brandId)} style={{ cursor: 'pointer' }}>
                        <TableCell>
                          <span style={{ marginRight: '8px' }}>{expandedBrands[brandId] ? '▼' : '►'}</span>
                          {brand.name}
                        </TableCell>
                        <TableCell align="right">{brand.count}</TableCell>
                        <TableCell align="right">{brand.value.toLocaleString()}</TableCell>
                      </TableRow>
                      {expandedBrands[brandId] && Object.entries(brand.models).map(([modelId, model]) => (
                        <TableRow key={`${brandId}-${modelId}`} style={{ backgroundColor: '#f5f5f5' }}>
                          <TableCell style={{ paddingLeft: '32px' }}>{model.name}</TableCell>
                          <TableCell align="right">{model.count}</TableCell>
                          <TableCell align="right">{model.value.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ height: '400px', width: '100%' }}>
                <canvas ref={pieChartRef}></canvas>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ height: '400px', width: '100%' }}>
                <canvas ref={barChartRef}></canvas>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
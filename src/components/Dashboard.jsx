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
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
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
  const [highlightedCars, setHighlightedCars] = useState([]);
  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);

  useEffect(() => {
    const processedData = {};
    const storedHighlightedCars = JSON.parse(localStorage.getItem('highlightedCars')) || [];
    setHighlightedCars(storedHighlightedCars);

    carData.Cars.forEach(car => {
      const brand = car.NameMMT.split(' ')[0]; // Extract brand from NameMMT

      if (!processedData[brand]) {
        processedData[brand] = {
          name: brand,
          count: 0,
          value: 0,
          models: {}
        };
      }

      processedData[brand].count++;
      processedData[brand].value += parseInt(car.Prc.replace(/,/g, ''), 10);

      if (!processedData[brand].models[car.MdID]) {
        processedData[brand].models[car.MdID] = {
          name: car.NameMMT,
          count: 0,
          value: 0,
          carIds: []
        };
      }

      processedData[brand].models[car.MdID].count++;
      processedData[brand].models[car.MdID].value += parseInt(car.Prc.replace(/,/g, ''), 10);
      processedData[brand].models[car.MdID].carIds.push(car.Cid);
    });

    setBrandData(processedData);
  }, []);

  useEffect(() => {
    if (Object.keys(brandData).length > 0) {
      renderCharts();
    }
  }, [brandData]);

  const toggleBrand = (brandName) => {
    setExpandedBrands(prev => ({
      ...prev,
      [brandName]: !prev[brandName]
    }));
  };

  const toggleHighlight = (carId) => {
    setHighlightedCars(prev => {
      const newHighlightedCars = prev.includes(carId)
        ? prev.filter(id => id !== carId)
        : [...prev, carId];
      
      localStorage.setItem('highlightedCars', JSON.stringify(newHighlightedCars));
      return newHighlightedCars;
    });
  };

  const renderCharts = () => {
    const brands = Object.values(brandData);
    const colors = generateColors(Math.max(...brands.map(brand => Object.keys(brand.models).length)));

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
          datasets: brands.reduce((acc, brand) => {
            Object.values(brand.models).forEach((model, index) => {
              if (!acc[index]) {
                acc[index] = {
                  label: model.name,
                  data: brands.map(() => 0),
                  backgroundColor: colors[index],
                };
              }
              acc[index].data[brands.indexOf(brand)] = model.count;
            });
            return acc;
          }, [])
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
    return Array.from({ length: count }, (_, i) => 
      `hsl(${(i * 360) / count}, 70%, 50%)`
    );
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
                    <TableCell align="center">Highlight Cars</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(brandData).map(([brandName, brand]) => (
                    <React.Fragment key={brandName}>
                      <TableRow onClick={() => toggleBrand(brandName)} style={{ cursor: 'pointer' }}>
                        <TableCell>
                          <span style={{ marginRight: '8px' }}>{expandedBrands[brandName] ? '▼' : '►'}</span>
                          {brand.name}
                        </TableCell>
                        <TableCell align="right">{brand.count}</TableCell>
                        <TableCell align="right">{brand.value.toLocaleString()}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      {expandedBrands[brandName] && Object.entries(brand.models).map(([modelId, model]) => (
                        <TableRow key={`${brandName}-${modelId}`} style={{ backgroundColor: '#f5f5f5' }}>
                          <TableCell style={{ paddingLeft: '32px' }}>{model.name}</TableCell>
                          <TableCell align="right">{model.count}</TableCell>
                          <TableCell align="right">{model.value.toLocaleString()}</TableCell>
                          <TableCell align="center">
                            <Button onClick={() => toggleHighlight(model.carIds[0])} style={{ minWidth: 'auto' }}>
                              {highlightedCars.includes(model.carIds[0]) ? '❤️' : '🤍'}
                            </Button>
                          </TableCell>
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
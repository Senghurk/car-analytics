import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import Dashboard from './components/Dashboard';
import HighlightedCars from './components/HighlightedCars';
import Reports from './components/Reports';

function App() {
  return (
    <Router>
      <div className="App">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Car Market Dashboard
            </Typography>
            <Button color="inherit" component={Link} to="/">Dashboard</Button>
            <Button color="inherit" component={Link} to="/highlighted">Highlighted Cars</Button>
            <Button color="inherit" component={Link} to="/reports">Reports</Button>
          </Toolbar>
        </AppBar>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/highlighted" element={<HighlightedCars />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

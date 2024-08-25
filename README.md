# Car Analytics Dashboard

## Description

The Car Analytics Dashboard is a web-based application designed to provide insightful analytics and visualization of car market data. This project aims to offer users a comprehensive view of various car brands, models, and their market presence through interactive charts and tables.

Key features of the dashboard include:

- **Brand and Model Overview**: A detailed breakdown of car brands and their respective models, showcasing the number of cars and their total market value.
- **Interactive Data Visualization**: Utilizing Chart.js to create dynamic pie charts and bar graphs, offering a visual representation of car distribution across brands and models.
- **Expandable Data Table**: An interactive table that allows users to drill down into specific brands and view detailed information about each model.
- **Highlighted Cars Section**: A feature that enables users to mark and track specific cars of interest, with data persisting across sessions.

## Technology Stack

- React.js
- Vite
- Chart.js
- Material-UI
- React Router

## Getting Started

### Prerequisites

- Node.js (v14 or later recommended)
- pnpm

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/senghurk/car-analytics.git
   ```

2. Navigate to the project directory:
   ```
   cd car-analytics
   ```

3. Install dependencies:
   ```
   pnpm install
   ```

4. Start the development server:
   ```
   pnpm run dev
   ```

5. Open your browser and visit `http://localhost:5173` to view the application.

## Deployment

This project is configured for deployment on GitHub Pages. To deploy:

1. Ensure your `vite.config.js` and `package.json` are correctly configured with your repository details.

2. Run the deploy script:
   ```
   pnpm run deploy
   ```

This will build the project and push it to the `gh-pages` branch of your repository.

## Contributing

Contributions to improve the Car Analytics Dashboard are welcome. Please feel free to submit pull requests or open issues to discuss potential enhancements.

## License

[MIT License](LICENSE)

## Acknowledgments

- Data source: [Provide the source of your car data if applicable]
- Icons and design inspiration: [If you've used any external resources, mention them here]
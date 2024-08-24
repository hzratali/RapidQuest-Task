import React from "react";
import SalesGrowthChart from "./components/SalesGrowthChart";
import TotalSalesChart from "./components/TotalSalesChart";
import NewCustomersChart from "./components/NewCustomersChart";
import RepeatCustomersChart from "./components/RepeatCustomersChart";
import GeoDistributionChart from "./components/GeoDistributionChart";
import CLTVChart from "./components/CLTVChart";

const App = () => {
  return (
    <div className="container mx-auto p-6">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
          E-commerce Data Visualization
        </h1>
        <p className="text-lg text-gray-600">
          Explore various metrics and trends to understand your e-commerce
          performance.
        </p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <SalesGrowthChart />
        </div>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <TotalSalesChart />
        </div>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <NewCustomersChart />
        </div>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <RepeatCustomersChart />
        </div>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <GeoDistributionChart />
        </div>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <CLTVChart />
        </div>
      </div>
    </div>
  );
};

export default App;

import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { fetchData } from "../utils/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SalesGrowthChart = () => {
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: "Sales Growth Rate",
        data: [],
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  });
  const [filter, setFilter] = useState("monthly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  useEffect(() => {
    const fetchSalesGrowth = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchData(`/sales-growth`, {
          interval: filter,
        });
        const labels = result.map((item) => item._id);
        const growthRates = result.map((item) => item.growthRate);

        setData({
          labels,
          datasets: [
            {
              label: "Sales Growth Rate",
              data: growthRates,
              fill: false,
              backgroundColor: "rgb(75, 192, 192)",
              borderColor: "rgba(75, 192, 192, 0.2)",
            },
          ],
        });
      } catch (err) {
        console.error("Error fetching sales growth data:", err);
        setError("Failed to load data");
      }
      setLoading(false);
    };

    fetchSalesGrowth();
  }, [filter]);

  return (
    <div className="w-full p-4">
      <h2 className="text-xl font-bold mb-4">Sales Growth Rate Over Time</h2>
      <div className="mb-4">
        <label htmlFor="filter" className="mr-2 font-semibold">
          Select Time Interval:
        </label>
        <select
          id="filter"
          value={filter}
          onChange={handleFilterChange}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : (
        <Line
          data={data}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    return `${context.label}: ${context.raw}`;
                  },
                },
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Time",
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Growth Rate (%)",
                },
                beginAtZero: true,
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default SalesGrowthChart;

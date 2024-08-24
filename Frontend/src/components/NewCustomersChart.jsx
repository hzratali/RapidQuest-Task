import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { fetchData } from "../utils/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const NewCustomersChart = () => {
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: "New Customers",
        data: [],
        backgroundColor: "rgba(153, 102, 255, 0.5)",
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
    const fetchNewCustomers = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchData(`/new-customers-over-time`, {
          interval: filter,
        });
        const labels = result.map((item) => item._id);
        const newCustomers = result.map((item) => item.newCustomers);

        setData({
          labels,
          datasets: [
            {
              label: "New Customers",
              data: newCustomers,
              backgroundColor: "rgba(153, 102, 255, 0.5)",
            },
          ],
        });
      } catch (err) {
        console.error("Error fetching new customers data:", err);
        setError("Failed to load data");
      }
      setLoading(false);
    };

    fetchNewCustomers();
  }, [filter]);

  return (
    <div className="w-full p-4">
      <h2 className="text-xl font-bold mb-4">New Customers Over Time</h2>
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
        <Bar
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
                  text: "Number of New Customers",
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

export default NewCustomersChart;

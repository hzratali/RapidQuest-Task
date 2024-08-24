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

const RepeatCustomersChart = () => {
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: "Repeat Customers",
        data: [],
        backgroundColor: "rgba(255, 159, 64, 0.5)",
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
    const fetchRepeatCustomers = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchData(`/repeated-customers`, {
          interval: filter,
        });
        const labels = result.map((item) => item._id);
        const repeatCustomers = result.map((item) => item.repeatCustomerCount);

        setData({
          labels,
          datasets: [
            {
              label: "Repeat Customers",
              data: repeatCustomers,
              backgroundColor: "rgba(255, 159, 64, 0.5)",
            },
          ],
        });
      } catch (err) {
        console.error("Error fetching repeat customers data:", err);
        setError("Failed to load data");
      }
      setLoading(false);
    };

    fetchRepeatCustomers();
  }, [filter]);

  return (
    <div className="w-full p-4">
      <h2 className="text-xl font-bold mb-4">Repeat Customers Over Time</h2>
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
                  text: "Number of Repeat Customers",
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

export default RepeatCustomersChart;

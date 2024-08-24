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

const TotalSalesChart = () => {
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: "",
        data: [],
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
    ],
  });
  const [interval, setInterval] = useState("monthly");
  const [loading, setLoading] = useState(false);

  const handleIntervalChange = (event) => {
    setInterval(event.target.value);
  };

  useEffect(() => {
    const fetchTotalSales = async () => {
      setLoading(true);
      try {
        const result = await fetchData(`/sales-over-time`, { interval });

        const labels = result.map((item) => item._id);
        const totalSales = result.map((item) => item.totalSales);

        setData({
          labels,
          datasets: [
            {
              label: "Total Sales",
              data: totalSales,
              backgroundColor: "rgba(54, 162, 235, 0.5)",
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchTotalSales();
  }, [interval]);

  return (
    <div className="w-full p-4">
      <h2 className="text-xl font-bold mb-4">Total Sales Over Time</h2>
      <div className="mb-4">
        <label htmlFor="interval" className="mr-2 font-semibold">
          Select Interval:
        </label>
        <select
          id="interval"
          value={interval}
          onChange={handleIntervalChange}
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
      ) : (
        <Bar data={data} />
      )}
    </div>
  );
};

export default TotalSalesChart;

import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { fetchData } from "../utils/api";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const CLTVChart = () => {
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: "Customer Lifetime Value",
        data: [],
        fill: false,
        backgroundColor: "rgba(75, 192, 192, 1)",
        borderColor: "rgba(75, 192, 192, 0.4)",
      },
    ],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCLTV = async () => {
      setLoading(true);
      try {
        const result = await fetchData("/customer-lifetime-value");

        const labels = result.map((item) => item._id);
        const cltv = result.map((item) => item.cohortCLTV);

        setData({
          labels,
          datasets: [
            {
              label: "Customer Lifetime Value by Cohorts",
              data: cltv,
              fill: false,
              backgroundColor: "rgba(75, 192, 192, 1)",
              borderColor: "rgba(75, 192, 192, 0.4)",
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setData({
          labels: [],
          datasets: [
            {
              label: "Error",
              data: [],
              fill: false,
              backgroundColor: "rgba(255, 99, 132, 0.5)",
              borderColor: "rgba(255, 99, 132, 1)",
            },
          ],
        });
      }
      setLoading(false);
    };

    fetchCLTV();
  }, []);

  return (
    <div className="w-full p-4">
      <h2 className="text-xl font-bold mb-4">Customer Lifetime Value</h2>
      {loading ? (
        <p className="text-center">Loading...</p>
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
                    return `${context.dataset.label}: ${context.parsed.y}`;
                  },
                },
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Cohort",
                },
              },
              y: {
                title: {
                  display: true,
                  text: "CLTV",
                },
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default CLTVChart;

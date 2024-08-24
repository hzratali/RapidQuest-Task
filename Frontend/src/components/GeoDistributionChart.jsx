import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { fetchData } from "../utils/api";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const GeoDistributionChart = () => {
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: "Geographical Distribution",
        data: [],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#FF9F40",
          "#4BC0C0",
        ],
      },
    ],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGeoDistribution = async () => {
      setLoading(true);
      try {
        const result = await fetchData("/geographical-distribution");
        const labels = result.map((item) => item._id);
        const customerCount = result.map((item) => item.customerCount);

        setData({
          labels,
          datasets: [
            {
              label: "Geographical Distribution",
              data: customerCount,
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#FF9F40",
                "#4BC0C0",
              ],
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setData({
          labels: ["Error"],
          datasets: [
            {
              label: "Error",
              data: [0],
              backgroundColor: ["#FF0000"],
            },
          ],
        });
      }
      setLoading(false);
    };

    fetchGeoDistribution();
  }, []);

  return (
    <div className="w-full p-4">
      <h2 className="text-xl font-bold mb-4">
        Geographical Distribution of Customers
      </h2>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <Pie
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
          }}
        />
      )}
    </div>
  );
};

export default GeoDistributionChart;

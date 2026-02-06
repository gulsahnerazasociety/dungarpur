import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function FundPieChart({ received, expense, available }) {
  const data = {
    labels: ["Received", "Expense", "Available"],
    datasets: [
      {
        data: [received, expense, available],
        backgroundColor: [
          "#4CAF50", // green
          "#F44336", // red
          "#2196F3"  // blue
        ],
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom"
      }
    }
  };

  return <Pie data={data} options={options} />;
}

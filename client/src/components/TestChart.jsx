import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function TestChart() {
  const data = {
    labels: ["A", "B", "C"],
    datasets: [
      {
        label: "Test Data",
        data: [12, 19, 3],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  return (
    <div style={{ width: "400px", height: "300px" }}>
      <Bar data={data} />
    </div>
  );
}

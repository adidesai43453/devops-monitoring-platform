import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import {
  useEffect,
  useState,
} from "react";

function MemoryChart() {
  const [data, setData] =
    useState([]);

  useEffect(() => {
    const loadData = () => {
      fetch(
        "http://localhost:5000/api/dashboard"
      )
        .then((res) => res.json())
        .then((metrics) => {
          setData((prev) => {
            const updated = [
              ...prev,
              {
                time:
                  new Date().toLocaleTimeString(),
                memory: Number(
                  metrics.avgMemory
                ),
              },
            ];

            return updated.slice(-20);
          });
        })
        .catch((err) =>
          console.error(err)
        );
    };

    loadData();

    const interval =
      setInterval(
        loadData,
        5000
      );

    return () =>
      clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">

      <h2 className="text-2xl font-bold text-slate-900 mb-6">
        Memory Usage History
      </h2>

      <div className="overflow-x-auto">

        <LineChart
          width={600}
          height={300}
          data={data}
        >
          <XAxis dataKey="time" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="memory"
            stroke="#16a34a"
            strokeWidth={3}
          />
        </LineChart>

      </div>

    </div>
  );
}

export default MemoryChart;
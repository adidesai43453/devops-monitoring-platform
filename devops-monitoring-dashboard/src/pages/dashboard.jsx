import { useState, useEffect } from "react";
import HostInfo from "../components/HostInfo";
import ServerTable from "../components/ServerTable";
import AlertsPanel from "../components/AlertsPanel";

import {
  FaServer,
  FaBell,
  FaChartLine,
  FaMemory,
  FaHome,
  FaNetworkWired,
} from "react-icons/fa";

function Dashboard() {
  const [selectedCard, setSelectedCard] =
    useState("servers");
  const [searchTerm, setSearchTerm] =
    useState("");

  const [metrics, setMetrics] =
    useState({
      containers: 0,
      avgCpu: 0,
      avgMemory: 0,
      networkRx: 0,
      networkTx: 0,
    });

  useEffect(() => {
    const loadDashboard = () => {
      fetch(
        "http://localhost:5000/api/dashboard"
      )
        .then((res) => res.json())
        .then((data) =>
          setMetrics(data)
        )
        .catch((err) =>
          console.error(err)
        );
    };

    loadDashboard();

    const interval =
      setInterval(
        loadDashboard,
        5000
      );

    return () =>
      clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex">

      {/* Sidebar */}

      <aside className="w-64 bg-white border-r border-gray-200 p-6">

        <h1 className="text-2xl font-bold text-slate-900 mb-10">
          DevOps Monitor
        </h1>

        <nav className="space-y-3">

          <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-blue-50 text-blue-600">
            <FaHome />
            Dashboard
          </button>

          <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100">
            <FaServer />
            Containers
          </button>

          <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100">
            <FaChartLine />
            Metrics
          </button>

          <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100">
            <FaBell />
            Alerts
          </button>

        </nav>

      </aside>

      {/* Main */}

      <main className="flex-1 p-8">

        {/* Header */}

        <div className="flex justify-between items-center mb-10">

          <div>

            <h1 className="text-4xl font-bold text-slate-900">
              Docker Monitoring Dashboard
            </h1>

            <p className="text-gray-500 mt-2">
              Real-time container monitoring
            </p>

          </div>

  <input
  placeholder="Search containers..."
  value={searchTerm}
  onChange={(e) =>
    setSearchTerm(
      e.target.value
    )
  }
  className="bg-white text-slate-900 placeholder:text-slate-400 border border-gray-300 px-4 py-3 rounded-xl w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
 
/>

        </div>

        {/* KPI Cards */}

        <div className="grid lg:grid-cols-4 gap-6 mb-10">

          <Card
            title="Containers"
            value={metrics.containers}
            status={`${metrics.running} Running`}
            icon={<FaServer />}
            active={
              selectedCard === "servers"
            }
            onClick={() =>
              setSelectedCard("servers")
            }
          />

          <Card
            title="CPU Usage"
            value={`${metrics.avgCpu}%`}
            status="Live"
            icon={<FaChartLine />}
            active={
              selectedCard === "cpu"
            }
            onClick={() =>
              setSelectedCard("cpu")
            }
          />

          <Card
            title="Memory"
            value={`${metrics.avgMemory} MB`}
            status="Healthy"
            icon={<FaMemory />}
            active={
              selectedCard === "memory"
            }
            onClick={() =>
              setSelectedCard("memory")
            }
          />

          <Card
            title="Network RX"
            value={`${metrics.networkRx} MB`}
            status={`TX ${metrics.networkTx} MB`}
            icon={<FaNetworkWired />}
            active={
              selectedCard === "network"
            }
            onClick={() =>
              setSelectedCard("network")
            }
          />

        </div>

        <div className="mb-8">
  <HostInfo />
</div>

{/* Live Metrics */}

        {/* Live Metrics */}

        <div className="grid lg:grid-cols-2 gap-6 mb-8">

          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">

            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              CPU Monitoring
            </h2>

            <p className="text-gray-500 mb-6">
              Average CPU utilization across
              all running Docker containers.
            </p>

            <div className="text-6xl font-bold text-blue-600">
              {metrics.avgCpu}%
            </div>

          </div>

          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">

            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Memory Monitoring
            </h2>

            <p className="text-gray-500 mb-6">
              Average memory usage across
              all running Docker containers.
            </p>

            <div className="text-6xl font-bold text-green-600">
              {metrics.avgMemory} MB
            </div>

          </div>

        </div>

        {/* Table + Alerts */}

        <div className="grid lg:grid-cols-3 gap-6 mb-8">

          <div className="lg:col-span-2">
          <ServerTable
  searchTerm={searchTerm}
/>
          </div>

          <AlertsPanel />

        </div>

        {/* Detail Panel */}

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200">

          {selectedCard === "servers" && (
            <>
              <h2 className="text-2xl font-bold mb-4">
                Container Overview
              </h2>

              <p className="text-gray-600">
                Monitoring all active Docker
                containers running on the host.
              </p>
            </>
          )}

          {selectedCard === "cpu" && (
            <>
              <h2 className="text-2xl font-bold mb-4">
                CPU Analytics
              </h2>

              <div className="text-5xl font-bold text-blue-600">
                {metrics.avgCpu}%
              </div>
            </>
          )}

          {selectedCard === "memory" && (
            <>
              <h2 className="text-2xl font-bold mb-4">
                Memory Analytics
              </h2>

              <div className="text-5xl font-bold text-green-600">
                {metrics.avgMemory} MB
              </div>
            </>
          )}

          {selectedCard === "network" && (
            <>
              <h2 className="text-2xl font-bold mb-4">
                Network Analytics
              </h2>

              <div className="space-y-2">

                <p>
                  RX:
                  {" "}
                  {metrics.networkRx}
                  {" "}
                  MB
                </p>

                <p>
                  TX:
                  {" "}
                  {metrics.networkTx}
                  {" "}
                  MB
                </p>

              </div>
            </>
          )}

        </div>

      </main>

    </div>
  );
}

function Card({
  title,
  value,
  status,
  icon,
  active,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer bg-white rounded-3xl p-6 border transition-all duration-300 ${
        active
          ? "border-blue-500 shadow-lg"
          : "border-gray-200 hover:shadow-md"
      }`}
    >
      <div className="flex justify-between">

        <div>

          <p className="text-gray-500">
            {title}
          </p>

          <h2 className="text-4xl font-bold text-slate-900 mt-2">
            {value}
          </h2>

          <p className="text-blue-600 mt-2">
            {status}
          </p>

        </div>

        <div className="text-3xl text-blue-600">
          {icon}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
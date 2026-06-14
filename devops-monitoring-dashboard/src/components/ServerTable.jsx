import { useEffect, useState } from "react";

function ServerTable({
  searchTerm,
}) {
  const [containers, setContainers] =
    useState([]);

  const [selectedContainer, setSelectedContainer] =
    useState(null);
  const [loading, setLoading] =
    useState(false);
  const [logs, setLogs] =
    useState("Loading logs...");

  useEffect(() => {
    const loadContainers = () => {
      fetch(
        "http://localhost:5000/api/containers"
      )
        .then((res) => res.json())
        .then((data) =>
          setContainers(data)
        )
        .catch((err) =>
          console.error(err)
        );
    };

    loadContainers();

    const interval = setInterval(
      loadContainers,
      5000
    );

 

    return () =>
      clearInterval(interval);
  },
   []);
   useEffect(() => {

    if (!selectedContainer) return;
  
    fetch(
      `http://localhost:5000/api/container/${selectedContainer.id}/logs`
    )
      .then((res) => res.json())
      .then((data) => {
  
        setLogs(
          data.logs ||
          "No logs available"
        );
  
      })
      .catch(() => {
  
        setLogs(
          "Failed to load logs"
        );
  
      });
  
  }, [selectedContainer]);

   const controlContainer = async (
    action,
    containerId
  ) => {
    try {
      setLoading(true);
  
      const response = await fetch(
        `http://localhost:5000/api/container/${containerId}/${action}`,
        {
          method: "POST",
        }
      );
  
      const data =
        await response.json();
  
      alert(
        data.message ||
        `${action} successful`
      );
      setLoading(false);
  
      setTimeout(() => {
  
        fetch(
          "http://localhost:5000/api/containers"
        )
          .then((res) => res.json())
          .then((data) =>
            setContainers(data)
          );
  
      }, 1000);
  
    } catch (error) {
  
      console.error(error);
      setLoading(false);
  
      alert(
        `Failed to ${action} container`
      );
  
    }
  };

  const filteredContainers =
  containers.filter(
    (container) => {

      const search =
        searchTerm.toLowerCase();

      return (
        container.name
          .toLowerCase()
          .includes(search) ||

        container.image
          .toLowerCase()
          .includes(search) ||

        container.status
          .toLowerCase()
          .includes(search)
      );
    }
  );


  return (
    <>
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8">

        <div className="flex justify-between items-center mb-8">

          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Docker Containers
            </h2>

            <p className="text-slate-500 mt-1">
              Real-time container monitoring
            </p>
          </div>

          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">
              {containers.length}
            </div>

            <div className="text-sm text-slate-500">
              Total Containers
            </div>
          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b border-gray-200 text-left text-slate-500">

                <th className="pb-4 font-semibold">
                  Container
                </th>

                <th className="pb-4 font-semibold">
                  Status
                </th>

                <th className="pb-4 font-semibold">
                  CPU
                </th>

                <th className="pb-4 font-semibold">
                  Memory
                </th>

                <th className="pb-4 font-semibold">
                  Uptime
                </th>

                <th className="pb-4 font-semibold">
                  Image
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredContainers.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="text-center py-10 text-slate-500"
                  >
                    No Docker Containers Found
                  </td>

                </tr>

              ) : (

                filteredContainers.map(
                  (container) => (

                    <tr
                      key={container.id}
                      onClick={() =>
                        setSelectedContainer(
                          container
                        )
                      }
                      className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition duration-300"
                    >

                      <td className="py-5 font-semibold text-slate-900">
                        {container.name}
                      </td>

                      <td className="py-5">

                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            container.status === "running"
                            ? "bg-green-100 text-green-700"
                            : container.status === "exited"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {container.status}
                        </span>

                      </td>

                      <td className="py-5 text-slate-700">
                        {container.cpu
                          ? `${container.cpu}%`
                          : "N/A"}
                      </td>

                      <td className="py-5 text-slate-700">
                        {container.memoryUsage
                          ? `${container.memoryUsage} MB`
                          : "N/A"}
                      </td>

                      <td className="py-5 text-slate-700">
                        {container.uptime ||
                          "N/A"}
                      </td>

                      <td className="py-5 text-slate-700">
                        {container.image}
                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

      {selectedContainer && (

<div
className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
onClick={() =>
  setSelectedContainer(null)
}
>

<div
  className="bg-white rounded-3xl p-8 w-[950px] shadow-2xl max-h-[90vh] overflow-y-auto"
  onClick={(e) =>
    e.stopPropagation()
  }
>

            <div className="flex justify-between items-center mb-8">

              <div>

                <h2 className="text-3xl font-bold text-slate-900">
                  {selectedContainer.name}
                </h2>

                <div className="flex items-center gap-3 mt-2">

<span
  className={`w-3 h-3 rounded-full ${
    selectedContainer.status ===
    "running"
      ? "bg-green-500"
      : "bg-red-500"
  }`}
/>

<p className="text-slate-500">
  Container Details
</p>

</div>

              </div>

              <button
                onClick={() =>
                  setSelectedContainer(
                    null
                  )
                }
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-red-100 transition"
              >
                ✕
              </button>

            </div>

            <div className="grid grid-cols-2 gap-5">

              <Metric
                label="Container Name"
                value={
                  selectedContainer.name
                }
              />

              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">

                <p className="text-sm text-slate-500">
                  Status
                </p>

                <div className="mt-3">

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      selectedContainer.status ===
                      "running"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {selectedContainer.status}
                  </span>

                </div>

              </div>

              <Metric
                label="CPU Usage"
                value={
                  selectedContainer.cpu
                    ? `${selectedContainer.cpu}%`
                    : "N/A"
                }
              />

              <Metric
                label="Memory Usage"
                value={
                  selectedContainer.memoryUsage
                    ? `${selectedContainer.memoryUsage} MB`
                    : "N/A"
                }
              />

              <Metric
                label="Memory Limit"
                value={
                  selectedContainer.memoryLimit
                    ? `${selectedContainer.memoryLimit} MB`
                    : "N/A"
                }
              />

              <Metric
                label="Container Uptime"
                value={
                  selectedContainer.uptime ||
                  "N/A"
                }
              />
              <div className="col-span-2">

<h3 className="text-lg font-bold text-slate-900">
  Network Statistics
</h3>

</div>

              <Metric
                label="Network RX"
                value={
                  selectedContainer.networkRx
                    ? `${selectedContainer.networkRx} MB`
                    : "0 MB"
                }
              />

              <Metric
                label="Network TX"
                value={
                  selectedContainer.networkTx
                    ? `${selectedContainer.networkTx} MB`
                    : "0 MB"
                }
              />

              <Metric
                label="Docker Image"
                value={
                  selectedContainer.image
                }
              />

              <Metric
                label="Container ID"
                value={
                  selectedContainer.id?.slice(
                    0,
                    12
                  )
                }
              />

            </div>

<div className="mt-8 flex gap-4">

  <button
   disabled={loading}
    onClick={() =>
      controlContainer(
        "start",
        selectedContainer.id
      )
    }
    className="px-5 py-3 rounded-xl bg-green-600 text-white hover:bg-green-700 transition"
  >
    Start
  </button>

  <button
   disabled={loading}
    onClick={() =>
      controlContainer(
        "stop",
        selectedContainer.id
      )
    }
    className="px-5 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
  >
    Stop
  </button>

  <button
   disabled={loading}
    onClick={() =>
      controlContainer(
        "restart",
        selectedContainer.id
      )
    }
    className="px-5 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
  >
    Restart
  </button>

</div>
<div className="mt-10">

  <h3 className="text-xl font-bold text-slate-900 mb-4">
    Container Logs
  </h3>

  <div className="bg-black text-green-400 rounded-2xl p-4 h-[300px] overflow-y-auto font-mono text-sm">

    <pre className="whitespace-pre-wrap">
      {logs}
    </pre>

  </div>

</div>

          </div>

        </div>

      )}

    </>
  );
}

function Metric({
  label,
  value,
}) {
  return (
    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">

      <p className="text-sm text-slate-500">
        {label}
      </p>

      <h3 className="text-xl font-bold text-slate-900 mt-2 break-all">
        {value}
      </h3>

    </div>
  );
}

export default ServerTable;
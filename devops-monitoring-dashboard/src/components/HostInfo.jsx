import {
    useEffect,
    useState,
  } from "react";
  
  function HostInfo() {
  
    const [hostInfo, setHostInfo] =
      useState(null);
  
    useEffect(() => {
  
      fetch(
        "http://localhost:5000/api/host-info"
      )
        .then((res) => res.json())
        .then((data) =>
          setHostInfo(data)
        )
        .catch((err) =>
          console.error(err)
        );
  
    }, []);
  
    if (!hostInfo)
      return null;
  
    return (
  
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8">
  
        <h2 className="text-3xl font-bold text-slate-900 mb-6">
          Docker Host
        </h2>
  
        <div className="grid grid-cols-3 gap-4">
  
          <InfoCard
            title="Docker Version"
            value={
              hostInfo.dockerVersion
            }
          />
  
          <InfoCard
            title="Operating System"
            value={
              hostInfo.operatingSystem
            }
          />
  
          <InfoCard
            title="CPU Cores"
            value={
              hostInfo.cpuCores
            }
          />
  
          <InfoCard
            title="Memory"
            value={`${hostInfo.totalMemory} GB`}
          />
  
          <InfoCard
            title="Running"
            value={
              hostInfo.running
            }
          />
  
          <InfoCard
            title="Stopped"
            value={
              hostInfo.stopped
            }
          />
  
        </div>
  
      </div>
  
    );
  }
  
  function InfoCard({
    title,
    value,
  }) {
    return (
      <div className="bg-gray-50 rounded-2xl p-5">
  
        <p className="text-sm text-slate-500">
          {title}
        </p>
  
        <h3 className="text-xl font-bold text-slate-900 mt-2">
          {value}
        </h3>
  
      </div>
    );
  }
  
  export default HostInfo;
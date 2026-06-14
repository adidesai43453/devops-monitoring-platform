function ContainerDetails({
    container,
  }) {
  
    if (!container)
      return null;
  
    return (
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
  
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Container Details
        </h2>
  
        <div className="grid md:grid-cols-2 gap-6">
  
          <Detail
            label="Container"
            value={container.name}
          />
  
          <Detail
            label="Image"
            value={container.image}
          />
  
          <Detail
            label="Status"
            value={container.status}
          />
  
          <Detail
            label="CPU"
            value={`${container.cpu}%`}
          />
  
          <Detail
            label="Memory"
            value={`${container.memoryUsage} MB`}
          />
  
          <Detail
            label="Uptime"
            value={container.uptime}
          />
  
          <Detail
            label="Network RX"
            value={`${container.networkRx} MB`}
          />
  
          <Detail
            label="Network TX"
            value={`${container.networkTx} MB`}
          />
  
        </div>
  
      </div>
    );
  }
  
  function Detail({
    label,
    value,
  }) {
    return (
      <div>
  
        <p className="text-gray-500 text-sm">
          {label}
        </p>
  
        <p className="font-semibold text-slate-900 text-lg">
          {value}
        </p>
  
      </div>
    );
  }
  
  export default ContainerDetails;
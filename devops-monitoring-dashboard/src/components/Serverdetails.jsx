function ServerDetails({
    server,
    onClose,
  }) {
    if (!server) return null;
  
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-end z-50">
  
        <div className="bg-white w-[500px] h-full shadow-2xl p-8 overflow-y-auto">
  
          <div className="flex justify-between items-center mb-8">
  
            <div>
  
              <h2 className="text-3xl font-bold text-slate-900">
                {server.name}
              </h2>
  
              <p className="text-gray-500">
                {server.location}
              </p>
  
            </div>
  
            <button
              onClick={onClose}
              className="text-2xl"
            >
              ✕
            </button>
  
          </div>
  
          <div className="grid grid-cols-2 gap-4 mb-8">
  
            <Metric
              title="CPU"
              value={server.cpu}
            />
  
            <Metric
              title="Memory"
              value={server.memory}
            />
  
            <Metric
              title="Uptime"
              value={server.uptime}
            />
  
            <Metric
              title="Health"
              value="97%"
            />
  
          </div>
  
          <div className="bg-gray-50 rounded-2xl p-5 mb-6">
  
            <h3 className="font-bold mb-4">
              Recent Logs
            </h3>
  
            <div className="space-y-3 text-sm">
  
              <p>
                ✓ Backup completed
              </p>
  
              <p>
                ✓ CPU normalized
              </p>
  
              <p>
                ✓ Database synced
              </p>
  
              <p>
                ✓ Security scan passed
              </p>
  
            </div>
  
          </div>
  
        </div>
  
      </div>
    );
  }
  
  function Metric({
    title,
    value,
  }) {
    return (
      <div className="bg-gray-50 rounded-xl p-4">
  
        <p className="text-gray-500 text-sm">
          {title}
        </p>
  
        <h3 className="font-bold text-xl text-slate-900 mt-2">
          {value}
        </h3>
  
      </div>
    );
  }
  
  export default ServerDetails;
function StatsCard({
    title,
    value,
    status,
  }) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-cyan-400 transition">
        
        <p className="text-slate-400 text-sm">
          {title}
        </p>
  
        <h2 className="text-3xl font-bold mt-2">
          {value}
        </h2>
  
        <p className="text-cyan-400 mt-2">
          {status}
        </p>
  
      </div>
    );
  }
  
  export default StatsCard;
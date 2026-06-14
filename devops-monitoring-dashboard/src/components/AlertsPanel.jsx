import {
  useEffect,
  useState,
} from "react";

function AlertsPanel() {

  const [alerts, setAlerts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {

    const loadAlerts = async () => {

      try {

        const response =
          await fetch(
            "http://localhost:5000/api/alerts"
          );

        if (!response.ok) {
          throw new Error(
            "Failed to load alerts"
          );
        }

        const data =
          await response.json();

        setAlerts(data);
        setError("");

      } catch (err) {

        console.error(err);

        setError(
          "Unable to fetch alerts"
        );

      } finally {

        setLoading(false);

      }

    };

    loadAlerts();

    const interval =
      setInterval(
        loadAlerts,
        5000
      );

    return () =>
      clearInterval(interval);

  }, []);

  return (

    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">

      {/* Header */}

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold text-slate-900">
          Recent Alerts
        </h2>

        <span className="text-blue-600 font-bold text-lg">
          {alerts.length}
        </span>

      </div>

      {/* Loading */}

      {loading && (

        <div className="text-slate-500">
          Loading alerts...
        </div>

      )}

      {/* Error */}

      {!loading && error && (

        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4">
          {error}
        </div>

      )}

      {/* Alerts */}

      {!loading &&
        !error && (

        <div className="space-y-4">

          {alerts.length === 0 ? (

            <div className="text-slate-500">
              No active alerts
            </div>

          ) : (

            alerts.map(
              (
                alert,
                index
              ) => (

                <div
                  key={index}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-sm transition"
                >

                  {/* Message */}

                  <div className="font-semibold text-slate-900">

                    {alert.message}

                  </div>

                  {/* Time + Severity */}

                  <div className="flex justify-between items-center mt-3">

                    <span className="text-sm text-slate-500">

                      {alert.time}

                    </span>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        alert.severity ===
                        "high"
                          ? "bg-red-100 text-red-600"
                          : alert.severity ===
                            "medium"
                          ? "bg-orange-100 text-orange-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >

                      {alert.severity}

                    </span>

                  </div>

                </div>

              )
            )

          )}

        </div>

      )}

    </div>

  );
}

export default AlertsPanel;
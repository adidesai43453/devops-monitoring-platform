const express = require("express");
const cors = require("cors");
const Docker = require("dockerode");

const app = express();

app.use(cors());
app.use(express.json());

const docker = new Docker();

app.get("/api/containers", async (req, res) => {
  try {

    const containers =
    await docker.listContainers({
      all: true,
    });
    const data = await Promise.all(
      containers.map(async (container) => {

        const dockerContainer =
          docker.getContainer(
            container.Id
          );

        const stats =
          await dockerContainer.stats({
            stream: false,
          });

        const inspect =
          await dockerContainer.inspect();

        const cpuDelta =
          (stats.cpu_stats?.cpu_usage?.total_usage || 0) -
          (stats.precpu_stats?.cpu_usage?.total_usage || 0);

        const systemDelta =
          (stats.cpu_stats?.system_cpu_usage || 0) -
          (stats.precpu_stats?.system_cpu_usage || 0);

        const onlineCpus =
          stats.cpu_stats?.online_cpus || 1;

        const cpuPercent =
          systemDelta > 0
            ? (
                (cpuDelta /
                  systemDelta) *
                onlineCpus *
                100
              ).toFixed(2)
            : "0.00";

        const memoryUsage =
          (
            (stats.memory_stats?.usage || 0) /
            1024 /
            1024
          ).toFixed(1);

        const memoryLimit =
          (
            (stats.memory_stats?.limit || 0) /
            1024 /
            1024
          ).toFixed(1);

        const started =
          new Date(
            inspect.State.StartedAt
          );

        const uptimeHours =
          Math.floor(
            (Date.now() -
              started.getTime()) /
              1000 /
              60 /
              60
          );

        const network =
          Object.values(
            stats.networks || {}
          );

        const rx =
          network.reduce(
            (sum, net) =>
              sum + net.rx_bytes,
            0
          ) /
          1024 /
          1024;

        const tx =
          network.reduce(
            (sum, net) =>
              sum + net.tx_bytes,
            0
          ) /
          1024 /
          1024;

        return {
          id: container.Id,
          name:
            container.Names[0].replace(
              "/",
              ""
            ),
          image: container.Image,
          status: container.State,
          cpu: cpuPercent,
          memoryUsage,
          memoryLimit,
          uptime: `${uptimeHours}h`,
          networkRx:
            rx.toFixed(2),
          networkTx:
            tx.toFixed(2),
        };
      })
    );

    res.json(data);

  } catch (error) {

    console.error(
      "Containers Error:",
      error
    );

    res.status(500).json({
      error:
        "Failed to fetch containers",
    });

  }
});

app.get("/api/dashboard", async (req, res) => {
  try {

    const containers =
      await docker.listContainers({
        all: true,
      });

    const runningContainers =
      containers.filter(
        (c) => c.State === "running"
      );

    let totalCpu = 0;
    let totalMemory = 0;
    let totalRx = 0;
    let totalTx = 0;

    await Promise.all(
      runningContainers.map(async (c) => {

        const container =
          docker.getContainer(c.Id);

        const stats =
          await container.stats({
            stream: false,
          });

        const cpuDelta =
          (stats.cpu_stats?.cpu_usage?.total_usage || 0) -
          (stats.precpu_stats?.cpu_usage?.total_usage || 0);

        const systemDelta =
          (stats.cpu_stats?.system_cpu_usage || 0) -
          (stats.precpu_stats?.system_cpu_usage || 0);

        const onlineCpus =
          stats.cpu_stats?.online_cpus || 1;

        const cpu =
          systemDelta > 0
            ? (
                (cpuDelta /
                  systemDelta) *
                onlineCpus *
                100
              )
            : 0;

        const memory =
          (stats.memory_stats?.usage || 0) /
          1024 /
          1024;

        const network =
          Object.values(
            stats.networks || {}
          );

        const rx =
          network.reduce(
            (sum, net) =>
              sum + net.rx_bytes,
            0
          ) /
          1024 /
          1024;

        const tx =
          network.reduce(
            (sum, net) =>
              sum + net.tx_bytes,
            0
          ) /
          1024 /
          1024;

        totalCpu += cpu;
        totalMemory += memory;
        totalRx += rx;
        totalTx += tx;

      })
    );

    res.json({
      containers:
        containers.length,

      running:
        runningContainers.length,

      avgCpu:
        runningContainers.length > 0
          ? (
              totalCpu /
              runningContainers.length
            ).toFixed(2)
          : "0.00",

      avgMemory:
        runningContainers.length > 0
          ? (
              totalMemory /
              runningContainers.length
            ).toFixed(1)
          : "0.0",

      networkRx:
        totalRx.toFixed(2),

      networkTx:
        totalTx.toFixed(2),
    });

  } catch (error) {

    console.error(
      "Dashboard Error:",
      error
    );

    res.status(500).json({
      error:
        "Failed to fetch dashboard metrics",
    });

  }
});

/* -----------------------------
   START CONTAINER
-------------------------------- */

app.post(
  "/api/container/:id/start",
  async (req, res) => {
    try {

      const container =
        docker.getContainer(
          req.params.id
        );

      await container.start();

      res.json({
        success: true,
        message:
          "Container started",
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        error:
          "Failed to start container",
      });

    }
  }
);

/* -----------------------------
   STOP CONTAINER
-------------------------------- */

app.post(
  "/api/container/:id/stop",
  async (req, res) => {
    try {

      const container =
        docker.getContainer(
          req.params.id
        );

      await container.stop();

      res.json({
        success: true,
        message:
          "Container stopped",
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        error:
          "Failed to stop container",
      });

    }
  }
);

/* -----------------------------
   RESTART CONTAINER
-------------------------------- */

app.post(
  "/api/container/:id/restart",
  async (req, res) => {
    try {

      const container =
        docker.getContainer(
          req.params.id
        );

      await container.restart();

      res.json({
        success: true,
        message:
          "Container restarted",
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        error:
          "Failed to restart container",
      });

    }
  }
);

/* -----------------------------
   CONTAINER LOGS
-------------------------------- */

app.get(
  "/api/container/:id/logs",
  async (req, res) => {
    try {

      const container =
        docker.getContainer(
          req.params.id
        );

      const logs =
        await container.logs({
          stdout: true,
          stderr: true,
          tail: 100,
        });

      res.json({
        logs:
          logs.toString(),
      });

    } catch (error) {

      console.error(
        "LOGS ERROR:",
        error
      );

      res.status(500).json({
        error:
          error.message,
      });

    }
  }
);

/* -----------------------------
   DOCKER HOST INFO
-------------------------------- */

app.get(
  "/api/host-info",
  async (req, res) => {
    try {

      const info =
        await docker.info();

      const version =
        await docker.version();

      res.json({
        dockerVersion:
          version.Version,

        operatingSystem:
          info.OperatingSystem,

        cpuCores:
          info.NCPU,

        totalMemory:
          (
            info.MemTotal /
            1024 /
            1024 /
            1024
          ).toFixed(2),

        containers:
          info.Containers,

        running:
          info.ContainersRunning,

        stopped:
          info.ContainersStopped,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        error:
          "Failed to fetch host info",
      });

    }
  }
);

app.get(
  "/api/alerts",
  async (req, res) => {

    try {

      const containers =
        await docker.listContainers({
          all: true,
        });

      const alerts = [];

      for (const c of containers) {

        /* STOPPED CONTAINERS */

        const name =
  c.Names[0].replace("/", "");

if (c.State === "exited") {

  alerts.push({
    severity: "high",
    message:
      `${name} has exited`,
    time:
      new Date().toLocaleTimeString(),
  });

  continue;
}

if (c.State === "created") {

  alerts.push({
    severity: "medium",
    message:
      `${name} is created but not started`,
    time:
      new Date().toLocaleTimeString(),
  });

  continue;
}

if (c.State === "restarting") {

  alerts.push({
    severity: "high",
    message:
      `${name} is restarting`,
    time:
      new Date().toLocaleTimeString(),
  });

  continue;
}

if (c.State === "paused") {

  alerts.push({
    severity: "medium",
    message:
      `${name} is paused`,
    time:
      new Date().toLocaleTimeString(),
  });

  continue;
}

        try {

          const container =
            docker.getContainer(c.Id);

          const stats =
            await container.stats({
              stream: false,
            });

          const memory =
            (
              (stats.memory_stats?.usage || 0) /
              1024 /
              1024
            );

          const cpuDelta =
            (stats.cpu_stats?.cpu_usage?.total_usage || 0) -
            (stats.precpu_stats?.cpu_usage?.total_usage || 0);

          const systemDelta =
            (stats.cpu_stats?.system_cpu_usage || 0) -
            (stats.precpu_stats?.system_cpu_usage || 0);

          const cpu =
            systemDelta > 0
              ? (
                  (cpuDelta /
                    systemDelta) *
                  (stats.cpu_stats?.online_cpus || 1) *
                  100
                )
              : 0;

          if (cpu > 80) {

            alerts.push({
              severity: "high",
              message:
                `${c.Names[0].replace("/", "")} CPU ${cpu.toFixed(1)}%`,
              time:
                new Date().toLocaleTimeString(),
            });

          }

          if (memory > 500) {

            alerts.push({
              severity: "medium",
              message:
                `${c.Names[0].replace("/", "")} Memory ${memory.toFixed(0)}MB`,
              time:
                new Date().toLocaleTimeString(),
            });

          }

        } catch (statsError) {

          console.error(
            "Stats Error:",
            statsError.message
          );

        }

      }

      res.json(alerts);

    } catch (error) {

      console.error(
        "Alerts Error:",
        error
      );

      res.status(500).json({
        error:
          "Failed to fetch alerts",
      });

    }

  }
);

app.listen(5000, () => {
  console.log(
    "Backend running on port 5000"
  );
});
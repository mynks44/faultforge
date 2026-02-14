import { useEffect, useState } from "react";
import { Activity, Cpu, MemoryStick } from "lucide-react";

function App() {
  const [cpu, setCpu] = useState<number>(0);
  const [memory, setMemory] = useState<number>(0);

  const fetchMetrics = async () => {
    const res = await fetch("http://127.0.0.1:8000/metrics");
    const data = await res.json();
    setCpu(data.cpu_percent);
    setMemory(data.memory_percent);
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 1000);
    return () => clearInterval(interval);
  }, []);

  const startCpu = async () => {
    await fetch("http://127.0.0.1:8000/start-cpu");
  };

  const stopCpu = async () => {
    await fetch("http://127.0.0.1:8000/stop-cpu");
  };

  const injectLatency = async () => {
    await fetch("http://127.0.0.1:8000/inject-latency");
  };

  return (
    <div className="min-h-screen p-10 bg-gray-950 text-white">
      <h1 className="text-4xl font-bold mb-10 flex items-center gap-3">
        <Activity className="text-red-500" />
        FaultForge Dashboard
      </h1>

      <div className="grid grid-cols-2 gap-6 mb-10">
        <div className="bg-gray-900 p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="text-yellow-400" />
            <h2 className="text-xl font-semibold">CPU Usage</h2>
          </div>
          <p className="text-3xl font-bold">{cpu}%</p>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <MemoryStick className="text-blue-400" />
            <h2 className="text-xl font-semibold">Memory Usage</h2>
          </div>
          <p className="text-3xl font-bold">{memory}%</p>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={startCpu}
          className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold"
        >
          Start CPU Stress
        </button>

        <button
          onClick={stopCpu}
          className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold"
        >
          Stop CPU Stress
        </button>

        <button
          onClick={injectLatency}
          className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold"
        >
          Inject Latency
        </button>
      </div>
    </div>
  );
}

export default App;

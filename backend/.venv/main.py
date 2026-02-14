from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
import time, threading, psutil

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

cpu_stress_running = False
worker_thread = None

def cpu_stress():
    while cpu_stress_running:
        pass

@app.get("/")
def root():
    return {"status": "FaultForge API running"}

@app.get("/inject-latency")
def inject_latency():
    time.sleep(2)
    return {"status": "Latency simulated (2s delay)"}

@app.get("/start-cpu")
def start_cpu():
    global cpu_stress_running, worker_thread
    if cpu_stress_running:
        return {"status": "CPU stress already running"}
    cpu_stress_running = True
    worker_thread = threading.Thread(target=cpu_stress, daemon=True)
    worker_thread.start()
    return {"status": "CPU stress started"}

@app.get("/stop-cpu")
def stop_cpu():
    global cpu_stress_running
    cpu_stress_running = False
    return {"status": "CPU stress stopped"}

@app.get("/metrics")
def metrics():
    return {
        "cpu_percent": psutil.cpu_percent(interval=0.2),
        "memory_percent": psutil.virtual_memory().percent
    }

@app.get("/dashboard", response_class=HTMLResponse)
def dashboard():
    return """
    <html>
    <head>
      <title>FaultForge Live Metrics</title>
      <script>
        async function loadMetrics(){
          const res = await fetch('/metrics');
          const data = await res.json();
          document.getElementById('cpu').innerText = data.cpu_percent + "%";
          document.getElementById('mem').innerText = data.memory_percent + "%";
        }
        setInterval(loadMetrics, 1000);
      </script>
    </head>
    <body style="font-family: Arial; padding: 20px;">
      <h1>FaultForge - Live Demo Dashboard</h1>
      <h2>CPU: <span id="cpu">Loading...</span></h2>
      <h2>Memory: <span id="mem">Loading...</span></h2>
      <p>Try: <b>/start-cpu</b>, <b>/stop-cpu</b>, <b>/inject-latency</b></p>
    </body>
    </html>
    """

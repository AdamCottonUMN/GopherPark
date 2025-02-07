from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import requests
from bs4 import BeautifulSoup
from datetime import datetime
import asyncio

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Backend is running!"}

UW_PARKING_URL = "https://transportation.wisc.edu/parking-lots/lot-occupancy-count/"
connected_clients = set()  # Store active WebSocket connections

async def fetch_parking_data():
    """Fetch real-time parking availability from UW Madison's website."""
    response = requests.get(UW_PARKING_URL)
    if response.status_code != 200:
        return {"error": "Failed to fetch UW parking data"}

    soup = BeautifulSoup(response.text, "html.parser")
    parking_data = []
    table_rows = soup.select("table tbody tr")

    for row in table_rows:
        columns = row.find_all("td")
        if len(columns) >= 3:
            parking_data.append({
                "region": columns[0].text.strip(),
                "garage": " ".join(columns[1].text.split()),  
                "availability": columns[2].text.strip()
            })

    return {"lots": parking_data, "last_updated": datetime.now().isoformat()}

@app.websocket("/ws/parking")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time parking updates."""
    await websocket.accept()
    connected_clients.add(websocket)

    try:
        while True:
            data = await fetch_parking_data()
            await websocket.send_json(data)  # Send data to the client
            await asyncio.sleep(10)  # Refresh every 10 seconds
    except WebSocketDisconnect:
        connected_clients.remove(websocket)  # Remove disconnected client


import uvicorn

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
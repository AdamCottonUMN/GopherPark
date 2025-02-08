import { useEffect, useState } from "react";
import Header from "../components/Header";  // Import Header component

export default function Home() {
  const [parkingData, setParkingData] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("");
  const [prevData, setPrevData] = useState({});
  const [changeEffects, setChangeEffects] = useState({});
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortKey, setSortKey] = useState(null);

  useEffect(() => {
    const socket = new WebSocket("wss://gopherpark-backend-production.up.railway.app/ws/parking");

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      let newLots = data.lots;

      const changes = {};
      newLots.forEach(lot => {
        const prevValue = prevData[lot.garage] || 0;
        const currentValue = lot.availability === "FULL" ? 0 : parseInt(lot.availability) || 0;

        if (currentValue !== prevValue) {
          changes[lot.garage] = currentValue > prevValue ? "increase" : "decrease";
        }
      });

      if (sortKey === "availability") {
        newLots = sortParkingData(newLots, sortOrder);
      }

      setParkingData(newLots);
      setLastUpdated(data.last_updated);
      setPrevData(prev => {
        const newPrevData = { ...prev };
        newLots.forEach(lot => {
          newPrevData[lot.garage] = lot.availability === "FULL" ? 0 : parseInt(lot.availability) || 0;
        });
        return newPrevData;
      });

      setChangeEffects(changes);
      Object.keys(changes).forEach(garage => {
        setTimeout(() => {
          setChangeEffects(prev => {
            const newEffects = { ...prev };
            delete newEffects[garage];
            return newEffects;
          });
        }, 1000);
      });
    };

    return () => socket.close();
  }, [sortOrder, sortKey, prevData]);

  // Sorting Function
  const sortParkingData = (data, order) => {
    return [...data].sort((a, b) => {
      const aValue = a.availability === "FULL" ? 0 : parseInt(a.availability) || 0;
      const bValue = b.availability === "FULL" ? 0 : parseInt(b.availability) || 0;
      return order === "asc" ? aValue - bValue : bValue - aValue;
    });
  };

  // Click to Sort
  const sortByAvailability = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    setSortKey("availability");
    setParkingData(prevData => sortParkingData(prevData, newOrder));
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center", backgroundColor: "#FFF8DC", minHeight: "100vh", paddingBottom: "20px" }}>
      <Header />
      <div style={{ paddingTop: "80px", maxWidth: "900px", margin: "auto" }}>
        <h1>UW Madison Parking Availability</h1>
        <p>Last updated: {new Date(lastUpdated).toLocaleString()}</p>
        {parkingData.length === 0 ? (
          <p>Loading parking data...</p>
        ) : (
          <>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px", backgroundColor: "white", borderTop: "3px solid maroon", borderBottom: "2px solid maroon" }}>
              <thead>
                <tr style={{ backgroundColor: "#FFFD96", borderBottom: "2px solid maroon" }}>
                  <th style={{ padding: "10px", borderLeft: "2px solid maroon", borderRight: "2px solid maroon" }}>Region</th>
                  <th style={{ padding: "10px", borderLeft: "2px solid maroon", borderRight: "2px solid maroon" }}>Garage</th>
                  <th 
                    style={{ 
                      padding: "10px", 
                      borderLeft: "2px solid maroon", 
                      borderRight: "2px solid maroon", 
                      cursor: "pointer", 
                      userSelect: "none" 
                    }}
                    onClick={sortByAvailability} // Click to sort
                  >
                    Availability {sortKey === "availability" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                  </th>
                </tr>
              </thead>
              <tbody>
                {parkingData.map((garage, index) => (
                  <tr key={index} style={{ borderBottom: "1px solid #ddd", backgroundColor: "white" }}>
                    <td style={{ padding: "10px", borderLeft: "2px solid maroon", borderRight: "2px solid maroon" }}>{garage.region}</td>
                    <td style={{ padding: "10px", borderLeft: "2px solid maroon", borderRight: "2px solid maroon" }}>{garage.garage}</td>
                    <td style={{
                      padding: "10px",
                      fontWeight: "bold",
                      position: "relative",
                      color: garage.availability === "FULL" ? "red" : (parseInt(garage.availability) > 0 ? "green" : "black"),
                      backgroundColor: changeEffects[garage.garage] === "increase"
                        ? "rgba(0, 255, 0, 0.2)"  
                        : changeEffects[garage.garage] === "decrease"
                        ? "rgba(255, 0, 0, 0.2)"  
                        : "transparent",
                      transition: "background-color 1s ease-out",
                      borderLeft: "2px solid maroon",
                      borderRight: "2px solid maroon"
                    }}>
                      {changeEffects[garage.garage] === "increase" && <span className="fadeUpLeft">▲</span>}
                      {garage.availability}
                      {changeEffects[garage.garage] === "decrease" && <span className="fadeDownRight">▼</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: "75px", padding: "15px", backgroundColor: "white", borderRadius: "8px", border: "4px solid maroon", textAlign: "left", lineHeight: "40px" }}>
              <h3 style={{ textAlign: "center" }}>About This Data</h3>
              <p>
                This table displays the <strong>real-time parking availability</strong> for various garages on the <strong>UW-Madison</strong> campus. 
                Availability numbers reflect the number of open spots currently available at each location.
              </p>
              <ul style={{ marginLeft: "40px" }}>
                <li><strong style={{ color: "green" }}>Green Numbers:</strong> Indicates that parking is available.</li>
                <li><strong style={{ color: "red" }}>Red "FULL":</strong> Indicates that the garage is at maximum capacity.</li>
                <li><strong>Change in availability:</strong> Denoted by green/red up/down arrows and color flashes.</li>
              </ul>
              <p>
                Data is updated in real-time and may <strong>fluctuate frequently</strong>. 
                Please check back often or refresh the page for the most current information. Errors in parking availability data may occur due to issues at the parking garages themselves.
                Data is sourced directly from the UW-Madison transportation website. 
                For more parking info, <a href="https://transportation.wisc.edu/visitor-parking/" className="clickable-link"> visit their website here</a>
              </p>
            </div>
          </>
        )}
      </div>
    <style>
        {`
          .fadeUpLeft {
            position: absolute;
            right: 100%;
            top: 50%;
            transform: translateY(0);
            color: green;
            font-size: 14px;
            opacity: 1;
            animation: fadeUpLeft 0.5s ease-out forwards;
          }

          .fadeDownRight {
            position: absolute;
            left: 100%;
            top: 50%;
            transform: translateY(0);
            color: red;
            font-size: 14px;
            opacity: 1;
            animation: fadeDownRight 0.5s ease-out forwards;
          }

          @keyframes fadeUpLeft {
            0% { transform: translate(-10px, 0); opacity: 1; }
            100% { transform: translate(-10px, -10px); opacity: 0; }
          }

          @keyframes fadeDownRight {
            0% { transform: translate(10px, 0); opacity: 1; }
            100% { transform: translate(10px, 10px); opacity: 0; }
          }
          .clickable-link {
            color: blue;
            text-decoration: underline;
            cursor: pointer;
          }

          .clickable-link:hover {
            color: darkblue;
            text-decoration: underline;
          }
        `}
    </style>
</div>

  );
}
import { useEffect, useState } from "react";
import Head from "next/head";  // Import Head for favicon
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
    <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center", backgroundColor: "#FFF8DC", minHeight: "100vh", paddingBottom: "20px", color: 'black !important' }}>
      {/* Favicon Added Here */}
      <Head>
        <link rel="icon" href="/gopherpark-favicon.png" type="image/png" />
      </Head>

      <Header />
      <div style={{ paddingTop: "80px", maxWidth: "900px", margin: "auto", color: 'black !important' }}>
        <h1 style={{ color: 'black !important' }}>UW Madison Parking Availability</h1>
        <p style={{ color: 'black !important' }}>Last updated: {new Date(lastUpdated).toLocaleString()}</p>
        {parkingData.length === 0 ? (
          <p style={{ color: 'black !important' }}>Loading parking data...</p>
        ) : (
          <>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px", backgroundColor: "white", borderTop: "3px solid maroon", borderBottom: "2px solid maroon", color: 'black !important' }}>
              <thead>
                <tr style={{ backgroundColor: "#FFFD96", borderBottom: "2px solid maroon" }}>
                  <th style={{ padding: "10px", borderLeft: "2px solid maroon", borderRight: "2px solid maroon", color: 'black !important' }}>Region</th>
                  <th style={{ padding: "10px", borderLeft: "2px solid maroon", borderRight: "2px solid maroon", color: 'black !important' }}>Garage</th>
                  <th 
                    style={{ 
                      padding: "10px", 
                      borderLeft: "2px solid maroon", 
                      borderRight: "2px solid maroon", 
                      cursor: "pointer", 
                      userSelect: "none",
                      color: 'black !important'
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
                    <td style={{ padding: "10px", borderLeft: "2px solid maroon", borderRight: "2px solid maroon", color: 'black !important' }}>{garage.region}</td>
                    <td style={{ padding: "10px", borderLeft: "2px solid maroon", borderRight: "2px solid maroon", color: 'black !important' }}>{garage.garage}</td>
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
          </>
        )}
      </div>
    </div>
  );
}

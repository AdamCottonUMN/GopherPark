# GopherPark

GopherPark is a web application that tracks **real-time parking garage availability at the University of Minnesota**, helping students quickly locate open parking without driving around multiple garages.

The system uses a **Python web scraping pipeline** to collect availability data and a **Next.js frontend** to display live garage occupancy metrics through an interactive dashboard.

---

## Features

- Real-time visualization of campus parking garage capacity  
- Automated parking availability data ingestion via web scraping  
- Dynamic frontend dashboard for monitoring garage occupancy  
- Responsive UI designed for both desktop and mobile users  

---

## Tech Stack

### Frontend
- Next.js  
- React  
- TypeScript  

### Backend / Data Pipeline
- Python  
- Web scraping scripts  

### Deployment
- Vercel  
- Netlify  

---

## Architecture

The application uses a lightweight pipeline to collect and visualize parking availability data.

---

## How It Works

1. A Python scraping pipeline periodically collects parking availability data from campus parking systems.
2. The scraper extracts garage capacity and occupancy information.
3. The processed data is exposed through API routes in the web application.
4. The React frontend fetches this data and renders live parking availability metrics.

---

## Future Improvements

- Predictive parking availability using historical data
- Mobile app integration  
- Notifications when garages reach capacity  
- Expanded coverage for additional campus parking structures  

---

## License

MIT License


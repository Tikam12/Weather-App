import { useEffect, useState } from 'react'
import './App.css'
import Temprature from './components/temprature'
import Highlights from './components/Highlights'
// import.meta.env.VITE_API_KEY
// import.meta.env.VITE_BASE_URL

function App() {
  
  const [city, setCity] = useState("New Delhi");
  const [iconClicked, setIconClicked] = useState(true);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    if (iconClicked) {

      const apiKey = import.meta.env.VITE_API_KEY;
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const apiUrl = `${baseUrl}/current.json?key=${apiKey}&q=${city}&aqi=no`;

      fetch(apiUrl)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Could not get data");
          }
          return res.json();
        })
        .then((data) => {
          console.log(data);
          setWeatherData(data);
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          setIconClicked(false); // Reset iconClicked after the API call is finished
        });
    }
  }, [iconClicked, city]); // Include city in the dependency array to trigger API call when city changes

  return (
    <div className="bg-slate-800 h-screen flex justify-center items-start ">
      <div className="w-1/3 h-1/3 mt-40 rounded-lg text-slate-200">
        {weatherData && (
          <Temprature
            setCity={setCity}
            setIconClicked={setIconClicked}
            stats={{
              temp: weatherData.current.temp_c,
              condition: weatherData.current.condition.text,
              isDay: weatherData.current.is_day,
              location: weatherData.location.name,
              time: weatherData.location.localtime,
            }}
          />
        )}
      </div>

      <div className="w-1/3 h mt-40 p-10 grid grid-cols-2 gap-6 bg-slate-600  rounded-lg text-slate-200">
        <h1 className="text-slate-200 text-2xl col-span-2 bg-slate-600 p-4 rounded-lg ">
          Today's Highlights
        </h1>
        {weatherData && (
          <>
            <Highlights
              stats={{
                title: "Wind Status",
                value: weatherData.current.wind_mph,
                unit: "mph",
                direction: weatherData.current.wind_dir,
              }}
            />
            <Highlights
              stats={{
                title: "Humidity",
                value: weatherData.current.humidity,
                unit: "%",
              }}
            />
            <Highlights
              stats={{
                title: "Visibility",
                value: weatherData.current.vis_miles,
                unit: "miles",
              }}
            />
            <Highlights
              stats={{
                title: "Air Pressure",
                value: weatherData.current.pressure_mb,
                unit: "mb",
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;

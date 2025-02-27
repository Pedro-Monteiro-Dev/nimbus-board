"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
//import { NextRequest, NextFetchEvent, NextResponse } from "next/server";
import { motion,} from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkerAlt} from '@fortawesome/free-solid-svg-icons'
import { useCallback } from 'react';


//import photo from '../assets/images/photo.jpg';

import "./styles.css";
import "./globals.css";

export default function Home() {

    interface LocationTimeInfo {
        dayOfWeek: string;
        day: string;
        month: string;
        year: string;
    }

    interface Location {
        region: string;
        country: string;
    }

    interface WeatherCondition {
        text: string;
    }
      
    interface Weather {
        current: {
            temp_c: number;
            condition: WeatherCondition;
            wind_kph: number;
            humidity: number;
        };
        location: Location;
    }

    const [loading, setLoading] = useState(true);

    const [weather, setWeather] = useState<Weather | null>(null);

    const [weatherAnimationKey, setWeatherAnimationKey] = useState(0);
    const [weatherAnimationExtraKey, setWeatherAnimationExtraKey] = useState(50);

    const [worldlocation, setLocation] =  useState<{ latitude: number; longitude: number } | null>(null);
    
    const [locationError,setLocationError] = useState<string | null>(null);

    const [searchLocations,setSearchLocations] = useState([]);
    const [tempCityName,setTempCityName] = useState();
    const [cityName,setCityName] = useState();
    const [displayWeatherName,setDisplayWeatherName] = useState<string | null>(null);

    const [searchBarFocused,setSearchBarFocused] = useState(false);
    const [query, setQuery] = useState("");

    const [locationTimeInfo,setLocationTimeInfo] = useState<LocationTimeInfo | null>(null);
    const [locationMonth,setLocationMonth] = useState<string | null>(null);
    
    const [weatherIcon,setWeatherIcon] = useState<string | null>(null);

    /*
    const isDayTime = (getAestheticTime: number) => {
        return getAestheticTime < 19;
    };*/

    const isDayTime = useCallback((time: number) => {
        return time < 19;
      }, []);

    const setAestheticTheme = useCallback((
        icon: string, 
        color_header: string, 
        color_gradient_a: string, 
        color_gradient_b: string, 
        color_panel: string, 
        color_text: string
      ) => {
        setWeatherIcon(icon);
        document.documentElement.style.setProperty('--navbar-color', color_header);
        document.documentElement.style.setProperty('--bg-color-gradient-a', color_gradient_a);
        document.documentElement.style.setProperty('--bg-color-gradient-b', color_gradient_b);
        document.documentElement.style.setProperty('--bg-color-panel', color_panel);
        document.documentElement.style.setProperty('--text-color', color_text);
    },[]);

    const handleWeatherAesthetic = useCallback((aesthetic: any, aestheticTime: number) => {
            setWeatherAnimationKey((prevKey) => prevKey + 1);
            setWeatherAnimationExtraKey((prevKey) => prevKey + 1);
            
            switch(aesthetic){
                case 1000://Sunny/Clear
                case 1003://Partly cloudy
                    setAestheticTheme("/images/sun.png","rgba(91, 165, 234, 0.5)","#C2D9ED","#6CB9FF","#C9DEFF","#000000");

                    setDisplayWeatherName(isDayTime(aestheticTime) ? "Sunny" : "Clear");
                    
                    break;
                case 1006://Cloudy
                case 1009://Overcast
                    setAestheticTheme("/images/cloud.png","rgba(91, 165, 234, 0.5)","#6588A8","#25639C","#5171A1","#ffffff");
                    setDisplayWeatherName("Cloudy");
                    break;
                case 1030://Mist
                case 1135://Fog
                case 1147://Freezing fog
                    setAestheticTheme("/images/fog.png","rgba(155, 181, 205, 0.5)","#A9B6C1","#B2CCE4","#D1D8E1","#000000");
                    setDisplayWeatherName("Fog");
                    break;
                case 1063://possible patchy rain
                case 1150://Patchy light drizzle
                case 1153://Light drizzle
                case 1168://Freezing drizzle
                case 1171://Heavy freezing drizzle
                case 1180://Patchy light rain
                case 1183://Light rain
                case 1186://Moderate rain at times
                case 1189://Moderate rain
                case 1192://Heavy rain at times
                case 1195://Heavy rain
                case 1198://Light freezing rain
                case 1201://Moderate or heavy freezing rain
                case 1240://Light rain shower
                case 1243://Moderate or heavy rain shower
                case 1246://Torrential rain shower
                    setAestheticTheme("/images/rainy.png","rgba(35, 111, 181, 0.5)","#656ba5","#6cb9ff","#1B427B","#ffffff");
                    setDisplayWeatherName("Raining");
                    break;
                case 1066://Patchy snow possible
                case 1069://Patchy sleet possible
                case 1072://Patchy freezing drizzle possible
                case 1204://Light sleet
                case 1207://Moderate or heavy sleet
                case 1210://Patchy light snow
                case 1213://Light snow
                case 1216://Patchy moderate snow
                case 1219://Moderate snow
                case 1222://Patchy heavy 
                case 1225://Heavy snow
                case 1237://Ice pellets
                case 1249://Light sleet showers
                case 1252://Moderate or heavy sleet showers
                case 1255://Light snow showers
                case 1258://Moderate or heavy snow showers
                case 1261://Light showers of ice pellets
                case 1264://Moderate or heavy showers of ice pellets
                case 1114://Blowing snow
                case 1117://Blizzard
                    setAestheticTheme("/images/snowflake.png","rgba(232, 249, 255, 0.5)","#D6E3EF","#BDEBFF","#ffffff","#000000");
                    setDisplayWeatherName("Snow");
                    break;
                case 1087://Thundery outbreaks possible
                case 1273://Patchy light rain with thunder
                case 1276://Moderate or heavy rain with thunder
                case 1279://Patchy light snow with thunder
                case 1282://Moderate or heavy snow with thunder
                    setAestheticTheme("/images/thunderstorm.png","rgba(47, 134, 214, 0.5)","#183D76","#27649C","#426AA6","#ffffff");
                    setDisplayWeatherName("Thunder");
                    break;
                default:
                    setAestheticTheme("","hsla(209, 68%, 42%, 0.5)","#6CB9FF","#C2D9ED","#C9DEFF","#000000");
                    //setDisplayWeatherName(null)
                    break;
                
            }
        },
        [
            setAestheticTheme,
            isDayTime,
            setDisplayWeatherName,
            setWeatherAnimationKey,
            setWeatherAnimationExtraKey,
        ] 
    );

    const handleSearchFocus = () =>{
        setSearchBarFocused(true);
    }

    const handleSearchBlur = () =>{
        setTimeout(() => { 
            setSearchBarFocused(false);
        }, 100);
        
    }

    const handleCountryName = (country: any) =>{
        switch(country){
            case "United States of America":
                break;
            default:

                break;
        }
    }

    const handleLocationTimeInfo = (month: number) =>{
        switch(month){
            case 1:
                setLocationMonth("Jan");
                break;
            case 2:
                setLocationMonth("Fev");
                break;
            case 3:
                setLocationMonth("Mar");
                break;
            case 4:
                setLocationMonth("Apr");
                break;
            case 5:
                setLocationMonth("May");
                break;
            case 6:
                setLocationMonth("Jun");
                break;
            case 7:
                setLocationMonth("Jul");
                break;
            case 8:
                setLocationMonth("Aug");
                break;
            case 9:
                setLocationMonth("Sep");
                break;
            case 10:
                setLocationMonth("Oct");
                break;
            case 11:
                setLocationMonth("Nov");
                break;
            case 12:
                setLocationMonth("Dec");
                break;
        }
        
    }

    const handleInputChange = (event:any) => {
        setQuery(event.target.value);
    };

    const changeLocation = (coords: { lat: any; lon: any; },cityLocation: React.SetStateAction<undefined>) => {
        const latitude = coords.lat;
        const longitude = coords.lon;
        setTempCityName(cityLocation);
        
        
        setLocation({ latitude, longitude });
        setQuery("");
    }

    useEffect(() => {
        const getWorldLocations = async() => {
        
            try{
            
                const response = await fetch(
                    `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?select=name%2Ccou_name_en%2Cpopulation%2Ccoordinates&where=search(name%2C%20"${query}")&order_by=population%20desc&limit=6`
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                setSearchLocations(data.results);
            
            } catch (error) {
                
                console.error("Error retrieving information: ",error);
            }
        }
        getWorldLocations();
    }, [query]);

    useEffect(() => {
        if (navigator.geolocation){
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude });
                },
                (error) => {
                    setLocationError(error.message);
                },

            );
        } else {
            setLocationError('Geolocation is not supported by this browser');
        };
    }, []);

    useEffect(() => {

        const getWeatherAndTime = async() => {
            if (worldlocation && worldlocation.latitude && worldlocation.longitude) {
                try {
                    //alert("started process")
                    setLoading(true);
                    

                    const getLocationData = await fetch(`https://timeapi.io/api/time/current/coordinate?latitude=${worldlocation.latitude}&longitude=${worldlocation.longitude}`);
                    const locationData = await getLocationData.json();
                    
                    setLocationTimeInfo(locationData);
                    
                    
                    handleLocationTimeInfo(locationData.month);
    
                    var getWeatherData
                    if (worldlocation.latitude != null && worldlocation.longitude != null){
                        getWeatherData = await fetch(`https://api.weatherapi.com/v1/current.json?key=5629d9586cd0401fb1e142501241508&q=${worldlocation.latitude},${worldlocation.longitude}`);
                    }
                    else
                    {
                        getWeatherData = await fetch('https://api.weatherapi.com/v1/current.json?key=5629d9586cd0401fb1e142501241508&q=Lisbon');
                    }
                    
                    const weatherData = await getWeatherData.json();
                    setWeather(weatherData);

                    //alert("aaa")
                    handleWeatherAesthetic(weatherData.current.condition.code,locationData.hour);
                    setCityName(tempCityName);
                    
                    setLoading(false);
                } catch (error) {
                    console.error("Error retrieving information: ",error);
                    setLoading(false);
                }
            }
            

        };

        getWeatherAndTime();
    }, [worldlocation,handleWeatherAesthetic, tempCityName]);    

    return (
        <div>
            <nav>
                <div id="navbar" className="flex flex-wrap">
                    <p id="navbar_logo">NimbusBoard</p>
                    <div id="searchbar" className="ml-auto">
                        <input id="searchbar_input"
                            type="text"
                            placeholder="Search.."
                            autoComplete="off"
                            onFocus={handleSearchFocus}
                            onBlur={handleSearchBlur}
                            value={query}
                            onChange={handleInputChange}
                            name="location_search">
                        </input>
                        
                        <ul id="search_results">
                            {searchBarFocused && (
                                searchLocations.length > 0 ? (
                                    searchLocations.map((item:any, index) => (
                                        <li key={index} onClick={() => changeLocation(item.coordinates,item.name)}>
                                            {item.name}, {item.cou_name_en}
                                        </li>
                                    ))
                                ) : (
                                    <li>No results found</li>
                                )
                            ) 
                                
                            }
                            
                        </ul>

                    </div>
                </div>
            </nav>

            {loading ? (
                <p>Loading...</p>
                 ) : (
                    weather && locationTimeInfo ? (

                <section id="weatherinfo" className="flex flex-wrap align-middle">
                    <motion.div
                        id="weatherbox"
                        key={weatherAnimationKey}
                        initial={
                            { 
                                opacity: 0,
                                y:200
                            }
                        }
                        animate={
                            { 
                                opacity: 1,
                                y:0
                            }
                        }
                        transition={{ duration: 1.0,type: "spring" }}
                        >
                        
                        <div id="weatherbox_main_attributes" className="flex flex-wrap">
                            <img id="weather_icon" src={weatherIcon || "missing_image.png"} alt="weather_icon"></img>

                            <div>
                                {/*<h1>{weather.current.temp_c}ºC</h1> CHECK THIS*/}
                                
                                <h1>{Math.floor(weather.current.temp_c)}ºC</h1>
                                <p>{displayWeatherName ? displayWeatherName : weather.current.condition.text}</p>
                                {/*<p>{weather.current.condition.text}</p>*/}
                            </div>
                        </div>
                        
                        <p><b>Wind:</b> {weather.current.wind_kph} km/h</p>
                        <p><b>Humidity:</b> {weather.current.humidity}%</p>
                    </motion.div>

                    <motion.div
                        id="weatherbox_info_extra"
                        key={weatherAnimationExtraKey}
                        initial={
                            { 
                                opacity: 0,
                                y:200
                            }
                        }
                        animate={
                            { 
                                opacity: 1,
                                y:0
                            }
                        }
                        transition={{ duration: 1.1,type: "spring"}}
                        >

                        <h1>{<FontAwesomeIcon icon={faMapMarkerAlt}/>} {cityName ? cityName : weather.location.region}, {weather.location.country}</h1>
                        {/*<h1>{weather.location.region}</h1>*/}
                        <p>{locationTimeInfo.dayOfWeek}</p>
                        <p>{locationTimeInfo.day} {locationMonth} {locationTimeInfo.year}</p>
                    </motion.div>

                    {/*
                    <div id="weatherSecondaryIcon">
                        <Image src="/images/umbrella.png" alt="Photo" width={700} height={700}/>
                    </div> 
                    */}
                    

                </section>
                
            ) : ( 
                <p>???</p>
            ))}
            
            
            
            {/*<button onClick={handletransition} className = "bg-gray-800 text-white py-2 px-4 rounded mb-4 hover:bg-gray-600">asasd</button>*/}
        </div>
    );
  }
  
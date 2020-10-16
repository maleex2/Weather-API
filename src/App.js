import React, { useState, useEffect, useRef} from 'react';
import SearchBar from "material-ui-search-bar";
import { gsap } from "gsap";
import { FaLinkedinIn , FaGithub } from 'react-icons/fa';
import {  RiMailSendLine} from 'react-icons/ri';
import {  CgProfile} from 'react-icons/cg';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import Typography from '@material-ui/core/Typography';


const api = {
  key: "26e8cd869a83e09ec49c88da79eb209b",
  base: "https://api.openweathermap.org/data/2.5/"
}

function App() {
  const [query, setQuery] = useState('');
  const [h1display, setH1display] = useState('');
  const [found, setFound] = useState('');
  const [weather, setWeather] = useState({});
  const [city, setCity] = useState(false);
  const [menuOpen, setMenuOpen] = useState(true);
  const animation = useRef(null);
  const box = useRef(null);
  const box1 = useRef(null);
  const h1 = useRef(null);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState();
  

  const handleClick = (newPlacement) => (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => placement !== newPlacement || !prev);
    setPlacement(newPlacement);
  };

  const search = evt => {
    if (evt.key === "Enter") {
      fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
        .then(res => res.json())
        .then(result => {
          setWeather(result);
          setQuery('');
          console.log(result);
          if(result.cod === 200){
            setMenuOpen(false);
            setCity(!city);
            setFound("");
          }
          else{
            setFound("Sorry, we couldn't find '"+ query + "'.")
            setMenuOpen(true);
          }
          
          
          
        });
    }
  }

  const dateBuilder = (d) => {
    let date = String(new window.Date())
    date = date.slice(3,15)
    return date
  }


  

  useEffect(() => {
    if(menuOpen===false){
    animation.current = gsap.timeline().to(box.current, {
      y: '-35vh' , duration: 2
    });
    animation.current = gsap.timeline().to(h1.current, {
      y: '-30vh' , duration: 2
    });
    animation.current = gsap.timeline().fromTo(h1.current, {
      opacity: 1}, {opacity: 0, duration: 1}
    );
    setH1display('display')
    
   
  }
    return () => {
      animation.current.kill();
    };
  }, [menuOpen,city]);

  

  useEffect(() => {
    animation.current = gsap.timeline().fromTo(box1.current, {
      opacity: 0}, {opacity: 1, duration: 2}
    );
    animation.current = gsap.timeline().to(box1.current, {
      display: 'block'
    });
    animation.current = gsap.timeline().to(box1.current, {
      y: '-26vh', duration: 2
    });
    
    
    return () => {
      animation.current.kill();
    };
  }, [city]);

  const closeHandler = () => {
    animation.current = gsap.timeline().fromTo(box1.current, {
      opacity: 1}, {opacity: 0, duration: 1}
    );
    animation.current = gsap.timeline().to(box1.current, {
      y: '0', duration: 2
    });
    animation.current = gsap.timeline().to(box.current, {
      y: '0' , duration: 2
    });
    animation.current = gsap.timeline().to(box1.current, {
      display: 'none'
    });
    animation.current = gsap.timeline().to(h1.current, {
      y: '0' , duration: 2
    });
    animation.current = gsap.timeline().fromTo(h1.current, {
      opacity: 0}, {opacity: 1, duration: 1}
    );
    setH1display('');
    
    
  }
 
  
   
  return (
    <div className="bg-effect">
      <div class="leftside">
        <ul>
          <li><CgProfile /></li>
          <li><FaLinkedinIn/></li>
          <li><FaGithub/></li>
          <li><RiMailSendLine/></li>
        </ul>
      </div>
      <Popper open={open} anchorEl={anchorEl} placement={placement} transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              <Typography>The content of the Popper.</Typography>
            </Paper>
          </Fade>
        )}
      </Popper>
      <main>
      
        <h1 className={h1display} ref={h1}>Simply Check The Weather</h1>
        <div ref={box} className="search-box">
        
        <SearchBar
            type="text"
            className="search-bar"
            placeholder="Search city..."
            onChange={(value) => setQuery(value) }
            value={query}
            onKeyPress={search}
            onRequestSearch={() => search}
            

            style={{
              margin: '0 auto',
              maxWidth: 800,
          }}
          
        />
        
        </div>
        
        

        {(typeof weather.main != "undefined") ? (
        <div ref={box1}>
          <div onClick={closeHandler} className="location-box">
          <button className='close'>x</button>
            <div className="location">{weather.name}, {weather.sys.country}</div>
            <div className="date">{dateBuilder(new Date())}</div>
          </div>
          <div className="weather-box">
            <div className="temp">
              {Math.round(weather.main.temp)}°c
            </div>
            <div className="weather">
                <img src={`http://openweathermap.org/img/wn/`+ weather.weather[0].icon + "@2x.png"} alt="icon"/>
              {weather.weather[0].description}
            </div>
            
          </div>
        </div>
        ) : (found !== "") ? (<h4>{found}</h4>) : ('')}
      </main>
      
    </div>
  );
}

export default App;

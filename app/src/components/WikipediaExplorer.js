import React, { useEffect, useState, useContext } from 'react';
import { LogContext } from './LogContext';

function WikipediaExplorer(props) {
  
  return (
    <>
      <div style={{height:"60px", background:"none", marginTop:"40px"}}>

      </div>
      <div style={{
        display:"flex", 
        flexDirection:"row", 
        marginLeft:"120px",
        marginBottom:"40px", 
        background:"none",
        width:"400px",
        height:"calc(100vh - 80px)",
      }}>
        <div style={{lineHeight:"1.6em"}}>
          <p>
          Richard Buckminster Fuller (/ˈfʊlər/; July 12, 1895 – July 1, 1983)[1] was an American architect, systems theorist, writer, designer, inventor, philosopher, and futurist. He styled his name as R. Buckminster Fuller in his writings, publishing more than 30 books and coining or popularizing such terms as "Spaceship Earth", "Dymaxion" (e.g., Dymaxion house, Dymaxion car, Dymaxion map), "ephemeralization", "synergetics", and "tensegrity".
          </p>
          <p>
          Fuller developed numerous inventions, mainly architectural designs, and popularized the widely known geodesic dome; carbon molecules known as fullerenes were later named by scientists for their structural and mathematical resemblance to geodesic spheres. He also served as the second World President of Mensa International from 1974 to 1983.[2][3]
          </p>
        </div>
      </div>
    </>
  );
}

export default WikipediaExplorer;

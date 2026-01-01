// --- Global Variables ---
// Timer manager for controlling animation loops
var TMan = new N6LTimerMan(); 
// ID for the main animation timer
var TimerID = -1; 

// Arrays to store IDs of X3D elements for planets (translation and rotation)
// IDs for sphere transformations (translation) for each planet
var IDTransA = new Array('sph00a', 'sph01a', 'sph02a', 'sph03a', 'sph04a', 'sph05a', 'sph06a', 'sph07a', 'sph08a', 'sph09a', 'sph10a', 'sph11a', 'sph12a', 'sph13a', 'sph14a');
// IDs for sphere transformations (Z-axis rotation, though not strictly used for rotation here)
var IDTransZ = new Array('sph00z', 'sph01z', 'sph02z', 'sph03z', 'sph04z', 'sph05z', 'sph06z', 'sph07z', 'sph08z', 'sph09z', 'sph10z', 'sph11z', 'sph12z', 'sph13z', 'sph14z');
// IDs for line transformations (translation) for orbits
var IDT = new Array('ln00t', 'ln01t', 'ln02t', 'ln03t', 'ln04t', 'ln05t', 'ln06t', 'ln07t', 'ln08t', 'ln09t', 'ln10t', 'ln11t', 'ln12t', 'ln13t', 'ln14t');
// IDs for line transformations (rotation) for orbits
var IDL = new Array('ln00l', 'ln01l', 'ln02l', 'ln03l', 'ln04l', 'ln05l', 'ln06l', 'ln07l', 'ln08l', 'ln09l', 'ln10l', 'ln11l', 'ln12l', 'ln13l', 'ln14l');

// X3DOM runtime object for scene manipulation
var x3domRuntime;
// Number of planets to simulate
var planetnum = 15;

// Variables for simulation control and state
var res; // Stores parsed CSV data
var bBBB; // Flag for animation direction (forward/backward: 1=forward, -1=reverse, 0=stop)
var bRunning = false; // Flag to indicate if the simulation is actively running
var bWaiting = false; // Flag to indicate if waiting for data to be read
var Speed = 1.0; // Simulation speed multiplier
var Zoom = 1.0; // Zoom level for X3DOM scene
var CalcWay = 0; // Calculation method (0: Keplerian orbits, 1: N-body simulation)
var fFst = 1; // First run flag (1: initial setup, -1: after first setup, 0: running)
var dat; // Current date object for simulation
var time; // Elapsed time in simulation (seconds)
var dt; // Time step for each simulation frame
var bRead = false; // Flag to check if planet data has been read from CSV
var bLAM = false; // Unused variable (possibly for LookAtMatrix, but not used in provided code)
var intvl = 40; // Interval for the main loop timer (in milliseconds)

// Astronomical Unit (AU) in meters for scaling
var CNST_AU = 1.49597870700e+11;

// Arrays for planet objects and their mass points
var planet = new Array(); // Stores N6LPlanet objects (orbital elements etc.)
var mp = new Array();     // Stores N6LMassPoint objects (position, velocity, mass etc. for simulation)
var rk = new N6LRngKt();  // Runge-Kutta solver for N-body simulation (N6LRngKt object)

// --- Initialization on Document Ready ---
// Executed when the entire HTML document has been loaded and parsed.
jQuery(document).ready(function(){
//  settestday(); // Commented out: Function to set a specific test date for debugging
  onNOW(); // Set current date and stop simulation
  onOO();  // Reset time and speed related form fields in the UI
  init(0); // Initialize simulation parameters (0 for stopped state)
  TimerID = TMan.add(); // Add a new timer instance to the N6LTimerMan
  GLoop(TimerID); // Start the main animation loop by scheduling its first run
});

// --- Main Animation Loop ---
// The core loop that updates the simulation and renders the X3D scene.
function GLoop(id){
  // Initialize x3domRuntime if not already obtained
  if(x3domRuntime == undefined) x3domRuntime = document.getElementById('x3dabs').runtime;
  else {
    viewp(); // Update camera viewpoint based on selected planet
    // If waiting for data to be read or during initial setup, perform waiting logic
    if(bWaiting || 0 < fFst) onWaiting();
    // If simulation is set to run, update the simulation frame
    if(bRunning) onRunning();
    // Adjust main loop interval based on the selected calculation method(comment-outed)
//    if(!CalcWay) intvl = 50; // Kepler method: faster updates for smoother animation
//    else intvl = 400; // N-body method: slower updates as it's computationally heavier
    // Change the timer manager's interval if it differs from the desired 'intvl'
    if(TMan.interval != intvl) TMan.changeinterval(intvl);
  }

  // Reschedule the main loop to run again after 'intvl' milliseconds using the timer manager
  TMan.timer[id].setalerm(function() { GLoop(id); }, intvl);
}

// --- Control Functions (Triggered by UI, assumed form F1) ---

// Set the current date and time in the UI and stop the simulation.
function onNOW() {
  var dt = new Date(); // Get current system date and time
  setday(dt); // Update the date/time input fields in the UI (F1)
  onSTP(); // Call the stop function to halt the simulation
}

// Reset the hour, minute, and second fields in the UI to zero, then stop the simulation.
function onOO() {
  F1.T4.value = 0; // Set Hour to 0
  F1.T5.value = 0; // Set Minute to 0
  F1.T6.value = 0; // Set Second to 0
  onSTP(); // Stop the simulation
}

// Set simulation speed and zoom to initial values (1.0), then stop.
function onIN() {
  F1.SPD.value = 1.0; // Set Speed to 1.0
  F1.ZOM.value = 1.0; // Set Zoom to 1.0
  onSTP(); // Stop the simulation
}

// Set simulation speed and zoom to "outer space" values (90.0 speed, 15.0 zoom), then stop.
function onOUT() {
  F1.SPD.value = 90.0; // Set Speed to 90.0
  F1.ZOM.value = 15.0; // Set Zoom to 15.0
  onSTP(); // Stop the simulation
}

// Stop the simulation and reset its state.
function onSTP() {
  bRunning = false; // Set the running flag to false
  init(0); // Re-initialize the simulation in a stopped state (direction 0)
}

// Initialize the simulation for reverse playback.
function onREV() {
  init(-1); // Initialize with a direction of -1 (reverse)
}

// Initialize the simulation for forward playback.
function onRUN() {
  init(1); // Initialize with a direction of 1 (forward)
}

// Update the date/time input fields in the UI (F1) with values from a given Date object.
function setday(dt) {
  var year = dt.getFullYear();
  var month = dt.getMonth() + 1; // getMonth() is 0-indexed, so add 1 for actual month
  var day = dt.getDate();
  var hour = dt.getHours();
  var minute = dt.getMinutes();
  var second = dt.getSeconds();
  F1.T1.value = year;
  F1.T2.value = month;
  F1.T3.value = day;
  F1.T4.value = hour;
  F1.T5.value = minute;
  F1.T6.value = second;
}

// Set the date/time input fields in the UI (F1) to a specific test date (January 1, 2000, 00:00:00).
function settestday() {
  F1.T1.value = 2000;
  F1.T2.value = 1;
  F1.T3.value = 1;
  F1.T4.value = 0;
  F1.T5.value = 0;
  F1.T6.value = 0;
}

// Initialize simulation parameters based on user input and selected calculation method.
function init(b) {
  bBBB = b; // Store the requested animation direction (0: stop, 1: forward, -1: reverse)
  // Set the simulation Speed based on the UI input and the 'b' parameter for direction
  if(0 <= b) Speed = Number(F1.SPD.value); // If 'b' is non-negative, use Speed as-is
  else Speed = Number(F1.SPD.value) * -1; // If 'b' is negative (reverse), negate the speed
  // Set the Zoom level from the UI input, ensuring it's always positive
  Zoom = Number(F1.ZOM.value);
  if(Zoom < 0.0) Zoom *= -1.0;

  // Determine the calculation method (Keplerian or N-body) from the selected radio button
  var radioList = document.getElementsByName("CALC");
  for(i = 0; i<radioList.length; i++){
      if(radioList[i].checked){
          CalcWay = Number(radioList[i].value); // 0 for Kepler, 1 for N-body
          break;
      }
  }

  bWaiting = false; // Reset the waiting flag, assuming data is ready or will be handled
  // Call the appropriate initialization function based on the chosen calculation method
  if(!CalcWay) InitKepler(); // Initialize for Keplerian orbits
  else InitRelative(); // Initialize for N-body simulation
  onWaiting(); // Call onWaiting to set up initial state, potentially triggering data load
}

// Handles the waiting state, typically for initial data loading or setup completion.
function onWaiting() {
  if(!bWaiting) { // Only proceed if not already in a waiting state
    fFst = -1; // Set flag to indicate that initial setup is complete but not yet running
    setmp(); // Update the positions of mass points (planets) in the X3DOM scene
    setline(); // Placeholder for a function to update orbit lines
    if(bBBB) bRunning = true; // If 'bBBB' (animation direction) is set, start the simulation
  }
}

// Executes the main simulation logic for each frame.
function onRunning() {
  // Constants for time unit conversions (re-declared locally for scope, though global exist)
  var msecPerMinute = 1000 * 60;
  var msecPerHour = msecPerMinute * 60;
  var msecPerDay = msecPerHour * 24;

  if(fFst != 0) { // Check if this is the very first execution after an 'init' call
    fFst = 0; // Mark that the first run has occurred
    time = 0.0; // Reset accumulated simulation time
    // Set the time step (dt) based on the chosen calculation method
    if(CalcWay) dt = Speed * 60 * 60; // For N-body, dt is in seconds (speed * 1 hour in seconds)
    else dt = Speed * msecPerDay / 1000; // For Kepler, dt is in milliseconds (speed * 1 day in sec)
  }
  
  // Call the appropriate frame update function based on the calculation method
  if(CalcWay) UpdateFrameRelative(); // Update frame using N-body simulation
  else UpdateFrameKepler(); // Update frame using Keplerian orbital calculations
}

// Retrieves the current date and time from the UI input fields (F1).
function getnow() {
  // Create a new Date object from the year, month (0-indexed), day, hour, minute, and second values from F1.
  var nt = new Date(Number(F1.T1.value), Number(F1.T2.value) - 1, Number(F1.T3.value), Number(F1.T4.value), Number(F1.T5.value), Number(F1.T6.value));
  return nt;
}

// Initializes the simulation for Keplerian orbit calculations.
function InitKepler() {
  if(!bRead) fFst = 1; // If planet data hasn't been read yet, set fFst to 1 to trigger CSV read
  dat = getnow(); // Get the current date and time from the UI
  PlanetInit(dat); // Initialize planet positions based on the current date
}

// Updates the simulation frame based on Keplerian orbital mechanics.
function UpdateFrameKepler() {
  // Constants for time unit conversions (re-declared locally)
  var msecPerMinute = 1000 * 60;
  var msecPerHour = msecPerMinute * 60;
  var msecPerDay = msecPerHour * 24;

  var dat1; // Variable to hold the new calculated date
  var day = time / msecPerDay * 1000; // Calculate elapsed days from simulation start time
  var tm = dt; // Current time step for this frame
  if(dt != 0.0) { // Only proceed if the time step is not zero
    time = time + tm; // Accumulate the total elapsed time

    var datt = dat.getTime(); // Get the timestamp of the base date
    var dat1t = datt + time * 1000; // Calculate the new timestamp by adding elapsed time
    var dat1 = new Date(dat1t); // Create a new Date object for the updated time

    PlanetInit(dat1);    // Re-initialize planet positions based on the new date
    setmp(); // Update X3DOM elements with the new planet positions
    setday(dat1); // Update the date/time input fields in the UI
  }
}

// Initializes the simulation for N-body (relative) calculations.
function InitRelative() {
  // Constants for time unit conversions (re-declared locally)
  var msecPerMinute = 1000 * 60;
  var msecPerHour = msecPerMinute * 60;
  var msecPerDay = msecPerHour * 24;
  if(!bRead) fFst = 1; // If planet data hasn't been read, set fFst to 1 to trigger CSV read
  dat = getnow(); // Get the current date and time from the UI
  PlanetInit(dat); // Initialize planet positions based on the current date (initial state for N-body)
  dt = Speed * 60 * 60; // Set the time step (dt) in seconds for the N-body simulation
  var pmp = new Array(); // Temporary array to hold mass points for the Runge-Kutta solver
  var i;
  for(i = 0; i < planetnum; i++) pmp[i] = new N6LMassPoint(mp[i]); // Create copies of current mass points
  rk.Init(pmp, dt, planet, dat, false); // Initialize the Runge-Kutta (rk) solver with the mass points and time step
}

// Updates the simulation frame using the N-body (relative) calculation method.
function UpdateFrameRelative() {
  // Constants for time unit conversions (re-declared locally)
  var msecPerMinute = 1000 * 60;
  var msecPerHour = msecPerMinute * 60;
  var msecPerDay = msecPerHour * 24;

  var dat1; // Variable to hold the new calculated date
  // Calculate total simulation time advance in seconds for this frame
  var tm = Math.abs(Speed) * msecPerDay / 1000;
  var adt = Math.abs(dt); // Absolute value of the time step
  var t; // Loop counter for sub-steps
  var i; // Loop counter for planets
  var datt = dat.getTime(); // Get the timestamp of the base date
  var dat1t = datt + time * 1000; // Calculate the new timestamp
  var dat1 = new Date(dat1t); // Create a new Date object for the updated time
  if(dt != 0.0) { // Only proceed if the time step is not zero
    // Loop through sub-steps for more accurate N-body integration (Runge-Kutta)
    for(t = adt; t <= tm; t += adt) { 
      //time = time + dt * 1000; // Accumulate the total elapsed time in milliseconds
      // Update the mass points (planets) using the Runge-Kutta solver
      rk.UpdateFrame();

      // フォームの表示をシミュレーション時間に強制同期させる
      time = rk.time;


      // Sun's origin correction: Adjust all planet positions to keep the Sun at the origin
      for(i = 1; i < planetnum; i++) { // Start from index 1 (assuming index 0 is the Sun)
        rk.mp[i].x = rk.mp[i].x.Sub(rk.mp[0].x); // Subtract the Sun's position vector from other planets
        mp[i].x = new N6LVector(rk.mp[i].x); // Update the main 'mp' array with the new relative position
      }
      rk.mp[0].x = rk.mp[0].x.ZeroVec(); // Explicitly set the Sun's position to zero (origin)
    }
    dat1t = datt + time * 1000; // Calculate the new timestamp
    dat1 = new Date(dat1t); // Create a new Date object for the updated time
    setmp(); // Update X3DOM elements with the new planet positions
    setday(dat1); // Update the date/time input fields in the UI
  }  
}

// Updates the translation (position) of X3DOM sphere elements to reflect calculated planet positions.
function setmp() {
  var i;
  for(i = 0; i < planetnum; i++) {
    var elm = document.getElementById(IDTransA[i]); // Get the X3D Transform element for the planet
    // Convert the internal N6LVector position (mp[i].x) to an X3DOM SFVec3f format.
    // The scaling by CNST_AU and Zoom is applied.
    // Note: X and Y axes are swapped (x[1], -x[0]) and Y is inverted. This is a common adjustment
    // when converting between different 3D coordinate systems (e.g., typical math vs. X3DOM).
    var sp = new x3dom.fields.SFVec3f(mp[i].x.x[1] / CNST_AU / Zoom, -mp[i].x.x[0] / CNST_AU / Zoom, mp[i].x.x[2] / CNST_AU / Zoom);
    elm.setAttribute('translation', sp.toString()); // Apply the calculated translation to the X3D element
  }
}

// Updates the camera viewpoint (position, orientation, and center of rotation) in the X3D scene.
function viewp() {
  if(!x3domRuntime) return; // Exit if the X3DOM runtime object is not yet available
  var selid = F1.VP.selectedIndex; // Get the ID of the currently selected planet from the dropdown (assumed F1.VP)
  var elm = document.getElementById('viewp000'); // Get the X3D Viewpoint element to be updated

  // Get the inverse of the current view matrix (which is effectively the world matrix for the camera)
  var SWM = x3domRuntime.viewMatrix().inverse(); // Retrieve world transformation matrix
  var WM = new N6LMatrix().FromX3DOM(SWM); // Convert X3DOM matrix to N6LMatrix format
  // Calculate the current eye position in world coordinates (where the camera is)
  var Seye = SWM.multMatrixPnt(new x3dom.fields.SFVec3f(0, 0, 0)); 
  // Determine the target position (where the camera should look at) based on the selected planet
  // Scaled by AU and Zoom, and adapted for X3DOM's coordinate system
  var sp = new x3dom.fields.SFVec3f(mp[selid].x.x[1] / CNST_AU / Zoom, -mp[selid].x.x[0] / CNST_AU / Zoom, mp[selid].x.x[2] / CNST_AU / Zoom);
  var Sat = x3dom.fields.SFVec3f.copy(sp); // Create a copy of the target position
  // Create an N6LVector representing the "look-at" target in the scene
  var lookat = new N6LVector([1.0, Sat.x, Sat.y, Sat.z], true); 
  var LAM = WM.LookAtMat2(lookat); // Calculate the look-at matrix (transforming camera to look at 'lookat')
  var Vec = LAM.Vector(); // Extract the rotation vector from the look-at matrix (represents orientation)
  var ori = Vec.ToX3DOM(); // Convert the rotation vector to an X3DOM orientation format

  // Apply the calculated position, orientation, and center of rotation to the X3D Viewpoint element
  elm.setAttribute('position', Seye.toString());
  elm.setAttribute('orientation', ori.toString());
  elm.setAttribute('centerOfRotation', sp.toString());
}

// --- Planet Initialization and Data Handling ---

// Initializes or updates planet positions based on the current simulation date.
function PlanetInit(dat) {
  // Constants for time unit conversions (re-declared locally)
  var msecPerMinute = 1000 * 60;
  var msecPerHour = msecPerMinute * 60;
  var msecPerDay = msecPerHour * 24;
  var i; // Loop counter for planets
  var j; // Unused loop counter in this function block

  if(0 < fFst) { // Check if this is the initial setup phase (fFst = 1 initially)
    // If it's the initial setup, data needs to be read from a file (e.g., CSV).
    if(!bWaiting) { // Ensure that data reading is not already in progress
      bWaiting = true; // Set the flag to indicate waiting for data
      // Call a function to read CSV data from PData000.txt.
      // 'analyzeCSV' and 'readedCSV' are callback functions for processing the data.
      readCSV('./javascripts/nas6lib/PData000.txt', 'analyzeCSV', 'readedCSV');
    }
    return; // Exit the function, as further planet initialization depends on loaded data
  }
  else { // If data has already been read (fFst is 0 or -1)
    for(i = 0; i < planetnum; i++) { // Loop through each planet
      var dat0 = planet[i].m_dat0; // Get the epoch date (reference date) for the planet's orbital elements
      var datt = dat.getTime(); // Get the timestamp of the current simulation date
      var dat0t = dat0.getTime(); // Get the timestamp of the epoch date
      var ddat = (datt - dat0t) / msecPerDay; // Calculate the number of days elapsed from the epoch to the current date
      var nday = ddat; // 'nday' represents the total days from epoch for Kepler calculation

      var xx = new Array(new N6LVector(3)); // Array to hold the position vector (x, y, z)
      var vv = new Array(new N6LVector(3)); // Array to hold the position vector (x, y, z)
      // Calculate the planet's position (xx) at 'nday' days from epoch using Keplerian elements
      var f = planet[i].kepler(nday, xx, vv); 
      planet[i].x0 = new N6LVector(3); // Initialize the planet's initial position vector

      // Copy the calculated Keplerian position components (x, y, z=0 in orbital plane)
      planet[i].x0.x[0] = xx[0].x[0];
      planet[i].x0.x[1] = xx[0].x[1];
      planet[i].x0.x[2] = 0.0; // Assuming the initial position is in the orbital plane (z=0)
      planet[i].v0.x[0] = vv[0].x[0];
      planet[i].v0.x[1] = vv[0].x[1];
      planet[i].v0.x[2] = 0.0; // Assuming the initial position is in the orbital plane (z=0)

      var xyz = new Array(new N6LVector(3)); // Array to hold coordinates after transformation to ecliptic plane
      // Transform the position from the orbital plane to the ecliptic plane (standard astronomical coordinate system)
      planet[i].ecliptic(planet[i].x0.x[0], planet[i].x0.x[1], planet[i].x0.x[2], xyz);
      // Check for invalid (NaN) results from the ecliptic transformation and reset if necessary
      if(isNaN(xyz[0].x[0]) || isNaN(xyz[0].x[1]) || isNaN(xyz[0].x[2])) {
        planet[i].x0.x[0] = 0.0;
        planet[i].x0.x[1] = 0.0;
        planet[i].x0.x[2] = 0.0;
      }
      else { // If the transformation is valid, update the planet's position (x0)
        planet[i].x0.x[0] = xyz[0].x[0];
        planet[i].x0.x[1] = xyz[0].x[1];
        planet[i].x0.x[2] = xyz[0].x[2];
      }
      var xyz2 = new Array(new N6LVector(3)); // Array to hold coordinates after transformation to ecliptic plane
      // Transform the position from the orbital plane to the ecliptic plane (standard astronomical coordinate system)
      planet[i].ecliptic(planet[i].v0.x[0], planet[i].v0.x[1], planet[i].v0.x[2], xyz2);
      // Check for invalid (NaN) results from the ecliptic transformation and reset if necessary
      if(isNaN(xyz2[0].x[0]) || isNaN(xyz2[0].x[1]) || isNaN(xyz2[0].x[2])) {
        planet[i].v0.x[0] = 0.0;
        planet[i].v0.x[1] = 0.0;
        planet[i].v0.x[2] = 0.0;
      }
      else { // If the transformation is valid, update the planet's position (x0)
        planet[i].v0.x[0] = xyz2[0].x[0];
        planet[i].v0.x[1] = xyz2[0].x[1];
        planet[i].v0.x[2] = xyz2[0].x[2];
      }
      // Create a new N6LMassPoint object for the planet with its initial position, velocity, mass, radius, and eccentricity
      mp[i] = new N6LMassPoint(planet[i].x0, planet[i].v0, planet[i].m_m, planet[i].m_r, planet[i].m_e);
    }
  }
}

// Callback function executed after the CSV data for planets has been successfully read.
function readedCSV(res) {
  // Constants for time unit conversions (re-declared locally)
  var msecPerMinute = 1000 * 60;
  var msecPerHour = msecPerMinute * 60;
  var msecPerDay = msecPerHour * 24;
  bWaiting = false; // Set waiting flag to false, as data is now available
  bRead = true; // Set flag to indicate that data has been read

  for(i = 0; i < planetnum; i++) { // Loop through each planet data row from the CSV result (res)

    // Extract planet properties from the CSV data array (res[i])
    var PlanetName = res[i][0]; // Planet Name
    var PlanetNo = Number(res[i][1]); // Planet Number
    var EpochYY = Number(res[i][2]); // Epoch Year
    var EpochMM = Number(res[i][3]); // Epoch Month
    var EpochDD = Number(res[i][4]); // Epoch Day
    var Epochh = Number(res[i][5]); // Epoch Hour
    var Epochm = Number(res[i][6]); // Epoch Minute
    var Epochs = Number(res[i][7]); // Epoch Second
    var a = Number(res[i][8]); // Semi-major axis
    var e = Number(res[i][9]); // Eccentricity
    var m0 = Number(res[i][10]); // Mean anomaly at epoch
    var npd = Number(res[i][11]); // Mean motion (degrees per day)
    var ra = Number(res[i][12]); // Longitude of ascending node
    var rb = Number(res[i][13]); // Argument of periapsis
    var p = Number(res[i][14]); // Period (likely orbital period)
    var ss = Number(res[i][15]); // Unused/unknown parameter (could be size/scale)
    var ii = Number(res[i][16]); // Inclination
    var ww = Number(res[i][17]); // Argument of periapsis (again? possibly ω vs ?)
    var m = Number(res[i][18]); // Mass
    var r = Number(res[i][19]); // Radius
    var mv = Number(res[i][20]); // Velocity multiplier/related

    // Create a Date object for the planet's epoch
    var dat0 = new Date(EpochYY, EpochMM - 1, EpochDD, Epochh, Epochm, Epochs);
    var datt = dat.getTime(); // Get timestamp of the current simulation date
    var dat0t = dat0.getTime(); // Get timestamp of the epoch date

    var ddat = (datt - dat0t) / msecPerDay; // Calculate days elapsed from epoch to current date

    // Initialize a new N6LPlanet object with the loaded orbital elements and current date
    planet[i] = new N6LPlanet();
    planet[i].Create(PlanetNo, PlanetName, ddat, dat0, a, e, m0, npd, ra, rb, p, ss, ii, ww, m, r, mv);

    // Initialize a new N6LMassPoint object with the planet's initial position (x0), velocity (v0), mass, radius, and eccentricity
    mp[i] = new N6LMassPoint(planet[i].x0, planet[i].v0, m, r, e);
  }
  return true; // Indicate successful completion of CSV data processing
}

// Function to set up and render planet orbit lines.
// This function calculates points along each planet's orbit and uses them to draw lines in the X3D scene.
function setline() {
  // Constants for time unit conversions (re-declared locally)
  var msecPerMinute = 1000 * 60;
  var msecPerHour = msecPerMinute * 60;
  var msecPerDay = msecPerHour * 24;
  var i; // Loop counter for planets
  var j; // Loop counter for orbit segments
  var k; // Loop counter for matrix/vector components
  var n = 32; // Number of segments to divide the orbit into (for drawing a polygon approximation)
  var str; // String to store the coordinates for the line segments

  // Loop through each planet, starting from index 1 (assuming index 0 is the Sun, which typically doesn't have an orbit line)
  for(i = 1; i < planetnum; i++) {
    str = ""; // Reset the coordinate string for the current planet's orbit
    var x0; // Variable to store the starting point of the orbit (to close the loop)

    // Calculate 32 segments for one revolution of the planet's orbit
    for(j = 0; j < n; j++) {
      // Calculate the angular displacement for the current segment.
      // This formula seems to be converting a fraction of a full period (360 degrees * 360 days / 365.2425 days in a year / planet's mean motion)
      // to determine the additional days to simulate for this segment.
      var ad = (360.0 * 360.0 / 365.2425 / planet[i].m_nperday) * (j / n);
      // Calculate the total number of days from the planet's epoch to the current simulation date
      var days = (dat.getTime() - planet[i].m_dat0.getTime()) / msecPerDay;
      var nday = days + ad; // Add the angular displacement days to get the simulation day for this point

      var xx = new Array(new N6LVector(3)); // Array to hold the position vector (x, y, z)
      var vv = new Array(new N6LVector(3)); // Array to hold the position vector (x, y, z)
      // Calculate the planet's position (xx) at 'nday' days from epoch using Keplerian elements
      var f = planet[i].kepler(nday, xx, vv);
      var x1 = new N6LVector(3); // New vector for the current point's position
      x1.x[0] = xx[0].x[0];
      x1.x[1] = xx[0].x[1];
      x1.x[2] = 0.0; // Assuming the orbit is initially calculated in a 2D plane (z=0)

      if(j == 0) x0 = new N6LVector(x1); // Store the first point to close the orbit loop later
      // Append the current point's coordinates to the string in X3DOM format (Y, -X, Z)
      // Scaled by AU and Zoom for visual representation.
      str += (x1.x[1] / CNST_AU / Zoom).toString() + " " + (-x1.x[0] / CNST_AU / Zoom).toString() + ", ";
    }
    // Append the starting point again to close the orbit line, forming a complete loop.
    str += (x0.x[1] / CNST_AU / Zoom).toString() + " " + (-x0.x[0] / CNST_AU / Zoom).toString();

    // Convert orbital angles (longitude of ascending node, inclination, argument of periapsis) to radians.
    // CNST_DR is likely a constant for Degrees to Radians conversion.
    var ss = planet[i].m_s * planet[i].CNST_DR; // Longitude of ascending node
    var ii = planet[i].m_i * planet[i].CNST_DR; // Inclination
    var ww = planet[i].m_w * planet[i].CNST_DR; // Argument of periapsis

    var vec = new N6LVector(3); // Temporary vector for axis definitions
    var mat = new N6LMatrix(3); // 3x3 rotation matrix
    // Construct the rotation matrix by applying rotations around Z (ss), Y (-ii), and Z (ww) axes.
    // This transforms the orbit from its orbital plane to the ecliptic plane.
    mat = mat.UnitMat().RotAxis(vec.UnitVec(2), ss).RotAxis(vec.UnitVec(1).Mul(-1.0), ii).RotAxis(vec.UnitVec(2), ww);
    
    // Prepare a 4x4 matrix (MatWK) for X3DOM rotation representation.
    // X3DOM uses a quaternion-like representation for rotation, often represented as a 4-component vector (axis-angle or quaternion).
    // The N6LMatrix is converted to a format suitable for X3DOM's 'rotation' attribute.
    var VecWK = new N6LVector(4); 
    var MatWK = new N6LMatrix(4); 
    MatWK.x[0] = VecWK.UnitVec(0); // Initialize first row (often for homogenous coordinate systems, though bHomo is set to false)
    MatWK.x[0].bHomo = false; // Disable homogenous coordinate for this row
    for(k = 1; k < 4; k++) { // Populate the rest of the 4x4 matrix from the 3x3 rotation matrix
      MatWK.x[k] = mat.x[k - 1].NormalVec().ToHomo(); // Convert 3x3 matrix rows to homogenous vectors
      MatWK.x[k].x[0] = 0.0; // Set first component to 0 (for rotation only)
      MatWK.x[k].bHomo = false; // Disable homogenous coordinate for these rows
    }
    VecWK = MatWK.NormalMat().Vector(); // Extract the rotation vector (likely a quaternion or axis-angle) from the normalized 4x4 matrix

    var elm; // Variable to hold X3D element
    var sp; // Variable to hold X3DOM SFVec3f or SFRotation

    // Update the 'IndexedLineSet' or similar element for the orbit lines.
    // The 'lineSegments' attribute likely takes a string of coordinate pairs.
    elm = document.getElementById(IDL[i]);
    elm.setAttribute('lineSegments', new String(str));

    // Apply the calculated rotation to the orbit line's transformation.
    elm = document.getElementById(IDT[i]); // Get the Transform node for the orbit line
    sp = VecWK.ToX3DOM(); // Convert the rotation vector to X3DOM's rotation format
    elm.setAttribute('rotation', sp.toString()); // Apply the rotation attribute
  }
}

 
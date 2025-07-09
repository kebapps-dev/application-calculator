function handleAppChange() {
  const app = document.getElementById("application").value;
  const pumpDiv = document.getElementById("pumpInputs");
  const liftDiv = document.getElementById("liftInputs");
  const rotaryTableDiv = document.getElementById("rotaryTableInputs");
  const resultsDiv = document.getElementById("results");
  const resultsDiv2 = document.getElementById("results2");

  resultsDiv.innerHTML = ""; // clear previous results
  resultsDiv2.innerHTML = ""; // clear previous results

  if (app === "Pump") {
    pumpDiv.style.display = "block";
    liftDiv.style.display = "none";
    rotaryTableDiv.style.display = "none";
  } else if (app === "Lift") {
    pumpDiv.style.display = "none";
    liftDiv.style.display = "block";
    rotaryTableDiv.style.display = "none";
  } else if (app === "Rotarytable") {
    pumpDiv.style.display = "none";
    liftDiv.style.display = "none";
    rotaryTableDiv.style.display = "block";
  }else{
    pumpDiv.style.display = "none";
    liftDiv.style.display = "none";
    rotaryTableDiv.style.display = "none";
  }
    loadSelectedScript();
}

function loadSelectedScript() {
      const select = document.getElementById("application");
      const selectedFile = select.value.toLowerCase() + ".js"; // Assuming the script files are named like "fan.js", "pump.js", etc.

      if (!selectedFile) return;

      const existingScript = document.querySelector(`script[src="${selectedFile}"]`);
      if (existingScript) {
        console.log("Script already loaded:", selectedFile);
        return;
      }

      const script = document.createElement("script");
      script.src = selectedFile;
      script.type = "text/javascript";
      script.onload = () => console.log(`Loaded: ${selectedFile}`);
      script.onerror = () => console.error(`Failed to load: ${selectedFile}`);

      document.body.appendChild(script);
    }

function loadGenericData(Application) {
    if (Application === "Pump") {
      document.getElementById("boreDiameter").value = "3.25";  
      document.getElementById("rodDiameter").value = "2";   
      document.getElementById("strokeLength").value = "8"; 
      document.getElementById("clampPressure").value = "181.1";  
      document.getElementById("timeOfStroke").value = "1.8";    
      document.getElementById("clampFlowRate").value = "25.7";           
      document.getElementById("rpm").value = "2300";  
      document.getElementById("motorEfficiency").value = "90";  
      document.getElementById("safetyFactor").value = "1.1";
    }
    if (Application === "Lift") {
      document.getElementById("loadWeight").value = "1000";  
      document.getElementById("liftHeight").value = "150";  
      document.getElementById("maxSpeed").value = "1";  
      document.getElementById("gearboxRatioLift").value = "50";
      document.getElementById("accelDecelTime").value = "2";  
      document.getElementById("drumDiameter").value = "110";  
    }
    if (Application === "Rotarytable") {
      document.getElementById("rotationalMoveDistance").value = "3.14"; 
      document.getElementById("totalMoveTime").value = "10";  
      document.getElementById("dwellTime").value = "2";  
      document.getElementById("accelTime").value = "2";  
      document.getElementById("decelTime").value = "2";  
      document.getElementById("massIndexTable").value = "50";  
      document.getElementById("radiusIndexTable").value = "0.5";  
      document.getElementById("gearboxRatioRotary").value = "10";
      document.getElementById("loadInertia").value = "0.1";  
      document.getElementById("frictionTorque").value = "0.5";
    }
    console.log("Generic data loaded for:", Application);
}
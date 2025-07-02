function handleAppChange() {
  const app = document.getElementById("application").value;
  const pumpDiv = document.getElementById("pumpInputs");
  const resultsDiv = document.getElementById("results");
  const resultsDiv2 = document.getElementById("results2");

  resultsDiv.innerHTML = ""; // clear previous results
  resultsDiv2.innerHTML = ""; // clear previous results

  if (app === "Pump") {
    pumpDiv.style.display = "block";
  } else {
    pumpDiv.style.display = "none";
  }
    loadSelectedScript();
}

function loadSelectedScript() {
      const select = document.getElementById("application");
      const selectedFile = select.value + ".js"; // Assuming the script files are named like "Fan.js", "Pump.js", etc.

      if (!selectedFile) return;

      const existingScript = document.querySelector(`script[src="${selectedFile}"]`);
      if (existingScript) {
        console.log("Script already loaded:", selectedFile);
        return;
      }

      const script = document.createElement("script").toLowerCase();
      script.src = selectedFile;
      script.type = "text/javascript";
      script.onload = () => console.log(`Loaded: ${selectedFile}`);
      script.onerror = () => console.error(`Failed to load: ${selectedFile}`);

      document.body.appendChild(script);
    }

function loadGenericData() {
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
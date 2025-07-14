function handleAppChange() {
  const app = document.getElementById("application").value;
  const pumpDiv = document.getElementById("pumpInputs");
  const liftDiv = document.getElementById("liftInputs");
  const rotaryTableDiv = document.getElementById("rotaryTableInputs");
  const conveyorDiv = document.getElementById("conveyorInputs");
  const genericRotaryDiv = document.getElementById("genericRotaryInputs");
  const blowerDiv = document.getElementById("blowerInputs");
  const spindleDiv = document.getElementById("spindleInputs");
  const resultsDiv = document.getElementById("results");
  const resultsDiv2 = document.getElementById("results2");
  const savedConfigBtn = document.getElementById("saveConfigBtn");
  const clearSavedConfigsBtn = document.getElementById("clearSavedConfigsBtn");
  resultsDiv.innerHTML = ""; // clear previous results
  resultsDiv2.innerHTML = ""; // clear previous results

  if (app === "Pump") {
    pumpDiv.style.display = "block";
    liftDiv.style.display = "none";
    rotaryTableDiv.style.display = "none";
    conveyorDiv.style.display = "none";
    genericRotaryDiv.style.display = "none";
    blowerDiv.style.display = "none";
    spindleDiv.style.display = "none";
    clearSavedConfigsBtn.style.display = "inline-block";
    savedConfigBtn.style.display = "inline-block";
  } else if (app === "Lift") {
    pumpDiv.style.display = "none";
    liftDiv.style.display = "block";
    rotaryTableDiv.style.display = "none";
    conveyorDiv.style.display = "none";
    genericRotaryDiv.style.display = "none";
    blowerDiv.style.display = "none";
    spindleDiv.style.display = "none";
    clearSavedConfigsBtn.style.display = "inline-block";
    savedConfigBtn.style.display = "inline-block";
  } else if (app === "Rotarytable") {
    pumpDiv.style.display = "none";
    liftDiv.style.display = "none";
    rotaryTableDiv.style.display = "block";
    conveyorDiv.style.display = "none";
    genericRotaryDiv.style.display = "none";
    blowerDiv.style.display = "none";
    spindleDiv.style.display = "none";
    clearSavedConfigsBtn.style.display = "inline-block";
    savedConfigBtn.style.display = "inline-block";
  } else if (app === "Conveyor") {
    pumpDiv.style.display = "none";
    liftDiv.style.display = "none";
    rotaryTableDiv.style.display = "none";
    conveyorDiv.style.display = "block";
    genericRotaryDiv.style.display = "none";
    blowerDiv.style.display = "none";
    spindleDiv.style.display = "none";
    clearSavedConfigsBtn.style.display = "inline-block";
    savedConfigBtn.style.display = "inline-block";
  }  else if (app === "Genericrotary") {
    pumpDiv.style.display = "none";
    liftDiv.style.display = "none";
    rotaryTableDiv.style.display = "none";
    conveyorDiv.style.display = "none";
    genericRotaryDiv.style.display = "block";
    blowerDiv.style.display = "none";
    spindleDiv.style.display = "none";
    clearSavedConfigsBtn.style.display = "inline-block";
    savedConfigBtn.style.display = "inline-block";
  } else if (app === "Blower") {
    pumpDiv.style.display = "none";
    liftDiv.style.display = "none";
    rotaryTableDiv.style.display = "none";
    conveyorDiv.style.display = "none";
    genericRotaryDiv.style.display = "none";
    blowerDiv.style.display = "block";
    spindleDiv.style.display = "none";
    clearSavedConfigsBtn.style.display = "inline-block";
    savedConfigBtn.style.display = "inline-block";
  } else if (app === "Spindle") {
    pumpDiv.style.display = "none";
    liftDiv.style.display = "none";
    rotaryTableDiv.style.display = "none";
    conveyorDiv.style.display = "none";
    genericRotaryDiv.style.display = "none";
    blowerDiv.style.display = "none";
    spindleDiv.style.display = "block";
    clearSavedConfigsBtn.style.display = "inline-block";
    savedConfigBtn.style.display = "inline-block";
  }else{
    pumpDiv.style.display = "none";
    liftDiv.style.display = "none";
    rotaryTableDiv.style.display = "none";
    conveyorDiv.style.display = "none";
    genericRotaryDiv.style.display = "none";
    blowerDiv.style.display = "none";
    spindleDiv.style.display = "none";
    savedConfigBtn.style.display = "none";
    clearSavedConfigsBtn.style.display = "none";
    savedConfigBtn.style.display = "none";
  }
    loadSelectedScript();
    
    // Show or hide the Save Configuration button
    document.getElementById("saveConfigBtn").style.display = app ? "block" : "none";
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
    if (Application === "Conveyor") {
      document.getElementById("conveyorLength").value = "10";
      document.getElementById("conveyorInclineAngle").value = "30";
      document.getElementById("beltSpeed").value = "0.5";
      document.getElementById("loadMass").value = "200";
      document.getElementById("rollerDiameter").value = ".2";
      document.getElementById("frictionCoefficient").value = ".03";
    }
    if (Application === "Genericrotary") {
      document.getElementById("genericRequiredSpeed").value = "1000";  
      document.getElementById("genericAccelTime").value = "2";
      document.getElementById("genericRunTime").value = "4";
      document.getElementById("genericDecelTime").value = "2";
      document.getElementById("genericRestTime").value = "2";
      document.getElementById("genericMomentOfInertia").value = "25";
      document.getElementById("genericFrictionTorque").value = "25";
      document.getElementById("genericThermalMarginPercent").value = "20"; // 20% thermal margin
    }
    if (Application === "Blower") {
      document.getElementById("blowerAirflow").value = "3000";
      document.getElementById("blowerPressure").value = "4";
      document.getElementById("blowerFanEff").value = "65";
      document.getElementById("blowerMotorEff").value = "90";
      document.getElementById("blowerRequiredSpeed").value = "1800";
    }
      console.log("Generic data loaded for:", Application);
}

function saveCurrentConfiguration() {
    // Get selected application
    const applicationSelect = document.getElementById("application");
    const selectedAppText = applicationSelect.options[applicationSelect.selectedIndex].text;

    // Get current date and time
    const now = new Date();
    const dateTimeString = now.toLocaleString();

    // Find the visible input-group div (excluding the application select group)
    const inputGroups = document.querySelectorAll('.input-group');
    let activeGroup = null;
    inputGroups.forEach(group => {
        // Skip the first input-group (application select)
        if (group.style.display !== "none" && group.querySelector('input')) {
            activeGroup = group;
        }
    });
    if (!activeGroup) {
        alert("No active configuration to save.");
        return;
    }

    // Get all input values in the active group
    const inputs = activeGroup.querySelectorAll('input, select');
    let configText = `Saved: ${dateTimeString}\nApplication: ${selectedAppText}\nConfiguration:\n`;
    inputs.forEach(input => {
        const label = activeGroup.querySelector(`label[for="${input.id}"]`);
        const labelText = label ? label.textContent : input.id;
        configText += `${labelText} ${input.value}\n`;
    });

    // Get the results text
    const resultsDiv = document.getElementById("results");
    const results2Div = document.getElementById("results2");
    let resultsText = "";
    if (resultsDiv && resultsDiv.innerText.trim()) {
        resultsText += "\nResults:\n" + resultsDiv.innerText.trim() + "\n";
    }
    if (results2Div && results2Div.innerText.trim()) {
        resultsText += "\nResults 2:\n" + results2Div.innerText.trim() + "\n";
    }

    // Combine and display in savedConfigs
    const savedConfigsDiv = document.getElementById("savedConfigs");
    const configBlock = document.createElement("pre");
    configBlock.textContent = configText + resultsText + "\n----------\n";
    savedConfigsDiv.appendChild(configBlock);
}

clearSavedConfigurations = () => {
  const savedConfigsDiv = document.getElementById("savedConfigs");
  savedConfigsDiv.innerHTML = "";
}
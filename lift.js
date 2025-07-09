let liftProductData = [];
let liftProductData2 = [];
// Load CSV data on page load
// Papa.parse("liftmotors.csv", {
//   download: true,
//   header: true,
//   complete: function(results) {
//     productData = results.data;
//     console.log("Product data loaded:", productData);
//   }
// });
// Papa.parse("motors.csv", {
//   download: true,
//   header: true,
//   complete: function(results) {
//     productData2 = results.data;
//     console.log("Product data2 loaded:", productData2);
//   }
// });

// Show/hide input groups based on application selected


// Find closest pump product based on flow input
function findClosestLiftMotor() {
  const resultsDiv = document.getElementById("results");
  const forceGravity = formulas.forcegravity(
    parseFloat(document.getElementById("loadWeight").value));
  const gearboxOutputSpeed = formulas.angularspeed(
    parseFloat(document.getElementById("maxSpeed").value),
    parseFloat(document.getElementById("drumDiameter").value))
  const motorSpeed = gearboxOutputSpeed * parseFloat(document.getElementById("gearboxRatioLift").value);
  const loadRequiredTorque = formulas.drumtorque(forceGravity,
    parseFloat(document.getElementById("drumDiameter").value)) // Convert diameter to radius
  const loadRequiredPeakTorque = formulas.peakdrumtorque(
    forceGravity,
    parseFloat(document.getElementById("drumDiameter").value),
    parseFloat(document.getElementById("loadWeight").value),
    formulas.peakacceleration(
      parseFloat(document.getElementById("maxSpeed").value),
      parseFloat(document.getElementById("accelDecelTime").value)
    )
  );
  const motorRequiredTorque = loadRequiredTorque / parseFloat(document.getElementById("gearboxRatioLift").value);
  const motorRequiredPeakTorque = loadRequiredPeakTorque / parseFloat(document.getElementById("gearboxRatioLift").value);
  const requiredMotorPowerKw = formulas.motorpowerkw(loadRequiredTorque,gearboxOutputSpeed)
  const requiredMotorPowerHp = formulas.motorpowerhp(loadRequiredTorque,gearboxOutputSpeed)

  if ((isNaN(loadRequiredTorque)) || isNaN(gearboxOutputSpeed)) {
    resultsDiv.innerHTML = "<p>Please enter valid input numbers.</p>";
    return;
  }

  // if (productData.length === 0) {
  //   resultsDiv.innerHTML = "<p>Product data not loaded yet.</p>";
  //   return;
  // }

  // let closestProduct = null;
  // let smallestDiff = Infinity;

  // productData.forEach(product => {
  //   //if (product.Application === "Pump") {
  //     const productFlow = parseFloat(product["Specific volume Vth [cm3/U]"]);
  //     if (!isNaN(productFlow)) {
  //       const diff = Math.abs(productFlow - pumpdisplacement);
  //       if (diff < smallestDiff) {
  //         smallestDiff = diff;
  //         closestProduct = product;
  //       }
  //     }
  //   //}
  // });

  

  //if (closestProduct) {
    resultsDiv.innerHTML = `
      <p><strong>
        Motor Speed: ${motorSpeed.toFixed(2)} RPM <br>
        Motor Required Torque: ${motorRequiredTorque.toFixed(2)} Nm <br>
        Motor Required Peak Torque: ${motorRequiredPeakTorque.toFixed(2)} Nm <br><br>

        Gearbox Output Speed: ${gearboxOutputSpeed.toFixed(2)} RPM <br>
        Gearbox Required Torque: ${loadRequiredTorque.toFixed(2)} Nm <br>
        Gearbox Peak Torque: ${loadRequiredPeakTorque.toFixed(2)} Nm <br><br>

        Required Motor Power: ${requiredMotorPowerKw.toFixed(2)} kW (${requiredMotorPowerHp.toFixed(2)} HP) <br>
      </strong></p>`;
    
// //} else {
//     resultsDiv.innerHTML = "<p>No sufficient pump product available.</p>";
// //}
//   selectedPumpname = closestProduct ? closestProduct.Pumpname : "Unknown";
//   selectedPumpdisplacement = closestProduct ? closestProduct["Specific volume Vth [cm3/U]"] : "Unknown";
//   selectedPumpefficiency = closestProduct ? closestProduct["Nhm[1]"] : "Unknown";
//   findClosestMotor(); // Automatically find closest motor after pump selection
//}

// Find closest motor product based on pump selection
function findClosestMotor() {
  const resultsDiv = document.getElementById("results2");
  const motortorque = 
    document.getElementById("safetyFactor").value *
        formulas.motortorque(selectedPumpdisplacement,
            parseFloat(document.getElementById("clampPressure").value), 
            selectedPumpefficiency);
  const motorspeed = 
    document.getElementById("safetyFactor").value *
        formulas.motorspeed(
            parseFloat(document.getElementById("clampFlowRate").value),
            selectedPumpdisplacement,
            selectedPumpefficiency);

  if (productData2.length === 0) {
    resultsDiv.innerHTML = "<p>Product data not loaded yet.</p>";
    return;
  }

  let closestProduct = null;
  let smallestDiff = Infinity;

    productData2.forEach(product => {
    if (product.Motorname.startsWith("V")) return; //dont include V motors
    const productMotortorque = parseFloat(product["Peak torque 20C [Nm]"]);
    const productMotorspeed = parseFloat(product["Nominal speed [rpm]"]);

    if (
        !isNaN(productMotortorque) &&
        !isNaN(productMotorspeed) &&
        productMotortorque >= motortorque &&
        productMotorspeed >= motorspeed
    ) {
        // You can base "closeness" on one of them, or both
        const diff = Math.abs(productMotortorque - motortorque); // only flow used

        if (diff < smallestDiff) {
        smallestDiff = diff;
        closestProduct = product;
        }
    }
    });


  if (closestProduct) {
    resultsDiv.innerHTML = `
      <p><strong>Closest Motor Product to required torque: ${motortorque.toFixed(2)} Nm <br/> 
      and required speed ${motorspeed.toFixed(2)} RPM: </strong></p>
      <ul>
        <li><strong>Model:</strong> ${closestProduct.Motorname}</li>
        <li><strong>Maximum Torque at 20C [Nm]:</strong> ${closestProduct["Peak torque 20C [Nm]"]}</li>
        <li><strong>Nominal Speed [rpm]</strong> ${closestProduct["Nominal speed [rpm]"]}</li>
      </ul>
    `;
} else {
    resultsDiv.innerHTML = "<p>No sufficient motor product available.</p>";
}
}
}
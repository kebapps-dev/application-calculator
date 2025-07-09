let rotarytableProductData = [];
let rotarytableProductData2 = [];
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
function findClosestRotaryTableMotor() {
  const resultsDiv = document.getElementById("results");
  const maxAngularSpeed = rotarytableformulas.maxangularspeed(
    parseFloat(document.getElementById("rotationalMoveDistance").value),
    parseFloat(document.getElementById("totalMoveTime").value),
    parseFloat(document.getElementById("accelTime").value),
    parseFloat(document.getElementById("decelTime").value),
    parseFloat(document.getElementById("gearboxRatioRotary").value));
  const maxRotationalSpeed = rotarytableformulas.maxrotationalspeed(
    maxAngularSpeed,
    parseFloat(document.getElementById("gearboxRatioRotary").value));
  const motorAcceleration = rotarytableformulas.motoracceleration(
    maxAngularSpeed,
    parseFloat(document.getElementById("accelTime").value));
  const motorDeceleration = rotarytableformulas.motordeceleration(
    maxAngularSpeed,
    parseFloat(document.getElementById("decelTime").value));

  const rotaryTableInertia = rotarytableformulas.rotaryTableInertia(
    parseFloat(document.getElementById("massIndexTable").value),
    parseFloat(document.getElementById("radiusIndexTable").value));
  const totalSystemInertia = rotarytableformulas.totalSystemInertia(
    rotaryTableInertia,
    parseFloat(document.getElementById("loadInertia").value),
    parseFloat(document.getElementById("gearboxRatioRotary").value));

  const torqueConstantFriction = rotarytableformulas.torqueConstantFriction(
    parseFloat(document.getElementById("frictionTorque").value),
    parseFloat(document.getElementById("gearboxRatioRotary").value));
  const torqueRequiredAcceleration = rotarytableformulas.torqueRequiredAcceleration(
    totalSystemInertia,
    motorAcceleration,
    torqueConstantFriction);
  const torqueRequiredDeceleration = rotarytableformulas.torqueRequiredDeceleration(
    totalSystemInertia,
    motorDeceleration, 
    torqueConstantFriction);
  const torqueRequiredConstantSpeed = rotarytableformulas.torqueRequiredConstantSpeed(
    torqueConstantFriction);
  const constantRunTime = rotarytableformulas.constantRunTime(
    parseFloat(document.getElementById("totalMoveTime").value),
    parseFloat(document.getElementById("accelTime").value),
    parseFloat(document.getElementById("decelTime").value));
  const torqueRmsMotor = rotarytableformulas.torqueRmsMotor(
    torqueRequiredAcceleration,
    torqueRequiredDeceleration,
    torqueRequiredConstantSpeed,
    parseFloat(document.getElementById("accelTime").value),
    parseFloat(document.getElementById("decelTime").value),
    constantRunTime,
    parseFloat(document.getElementById("totalMoveTime").value),
    parseFloat(document.getElementById("dwellTime").value));
  
  // const motorRequiredTorque = loadRequiredTorque / parseFloat(document.getElementById("gearboxRatio").value);
  // const motorRequiredPeakTorque = loadRequiredPeakTorque / parseFloat(document.getElementById("gearboxRatio").value);
  // const requiredMotorPowerKw = formulas.motorpowerkw(loadRequiredTorque,gearboxOutputSpeed)
  // const requiredMotorPowerHp = formulas.motorpowerhp(loadRequiredTorque,gearboxOutputSpeed)

  if ((isNaN(torqueRmsMotor)) || isNaN(constantRunTime)) {
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
        Calculated Maximum Angular Speed: ${maxAngularSpeed.toFixed(2)} Rad/Sec <br>
        Maximum Motor Rotational Speed: ${maxRotationalSpeed.toFixed(2)} RPM <br>
        Total System Inertia: ${totalSystemInertia.toFixed(2)} kg*m² <br><br>

        Calculated RMS Torque: ${torqueRmsMotor.toFixed(2)} Nm <br>
        Acceleration Torque: ${torqueRequiredAcceleration.toFixed(2)} Nm <br>
        Deceleration Torque: ${torqueRequiredDeceleration.toFixed(2)} Nm <br>
        Constant Speed Torque: ${torqueRequiredConstantSpeed.toFixed(2)} Nm <br><br>

        Verify motor rated torque is above the calculated RMS torque and rated peak torque is above the calculated acceleration and deceleration torques.
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
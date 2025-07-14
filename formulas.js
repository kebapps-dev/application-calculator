const formulas = {
  areaOfCircle: radius => Math.PI * radius * radius,
  flowRate: (volume, time) => volume / time,

  //pump calculations
  clamparea: (boreDiameter,rodDiameter) => (Math.PI*(boreDiameter/2)**2)-(Math.PI*(rodDiameter/2)**2), //in2
  clampvolume: (clamparea, strokeLength) => clamparea * strokeLength, //in3
  pumpflowrate: (timeOfStroke, clampvolume) => timeOfStroke > 0 ? (clampvolume / timeOfStroke)*0.9832 : 0, //convert in3/s to l/min
  pumpdisplacement: (pumpflowrate, rpm) => rpm > 0 ? (pumpflowrate * 1000) / rpm : 0, //cc/rev
  pumpclampingforce: (clampPressure, clamparea) => clampPressure * clamparea,
  motortorque: (selectedPumpDisplacement,clampPressure, volefficiency) => (selectedPumpDisplacement * clampPressure ) / (20 * Math.PI * volefficiency), //Nm
  motorspeed: (clampingFlowRate, selectedPumpDisplacement,volefficiency) => (clampingFlowRate * 1000 * volefficiency) / selectedPumpDisplacement, //rpm

  //lift calculations
  angularspeed: (maxSpeed, drumDiameter) => (maxSpeed * 60) / (Math.PI * (drumDiameter/1000)), // rp
  forcegravity: (mass, gravity = 9.81) => mass * gravity, // N
  drumtorque: (forcegravity, drumDiameter) => forcegravity * (drumDiameter/2000), // Nm

  peakacceleration: (maxSpeed, accelDecelTime) => maxSpeed / accelDecelTime, // m/s^2
  peakdrumtorque: (forcegravity, drumDiameter, mass, peakacceleration) => (drumDiameter/2000)*(forcegravity + (mass*(peakacceleration))), // Nm

  motorpowerkw: (torque, angularspeed) => (torque * angularspeed) /1000, // kW
  motorpowerhp: (torque, angularspeed) => (torque * angularspeed) / 745.7, // hp
};

const rotarytableformulas = {
  //https://www.kebamerica.com/blog/how-do-i-size-a-motor-for-my-application-rotary-index-table/
  maxangularspeed: (rotationalMoveDistance, totalMoveTime, accelTime, decelTime, gearboxRatio) => 
    gearboxRatio * (rotationalMoveDistance / (totalMoveTime - 0.5*accelTime - 0.5*decelTime)), // RPM
  maxrotationalspeed: (maxAngularSpeed, gearboxRatio) =>
    maxAngularSpeed * 60 * gearboxRatio / (2 * Math.PI), // RPM
  
  motoracceleration: (maxRotationalspeed, accelTime, gearboxRatio) => 
    maxRotationalspeed / accelTime, // RPM/s
  
  motordeceleration: (maxRotationalspeed, decelTime) => 
    maxRotationalspeed / decelTime, // RPM/s
  
  rotaryTableInertia: (massIndexTable, radiusIndexTable) => 
    0.5 * massIndexTable * (radiusIndexTable ** 2), 
  totalSystemInertia: (rotaryTableInertia, loadInertia, gearboxRatio) =>
    (rotaryTableInertia + loadInertia) / (gearboxRatio ** 2), 

  torqueConstantFriction: (frictionTorque, gearboxRatio) => frictionTorque / gearboxRatio, // Nm
  torqueRequiredAcceleration: (totalSystemInertia, motorAcceleration, torqueConstantFriction) =>
    (totalSystemInertia * motorAcceleration) + torqueConstantFriction, // Nm
  torqueRequiredDeceleration: (totalSystemInertia, motorDeceleration, torqueConstantFriction) =>
    (totalSystemInertia * motorDeceleration) + torqueConstantFriction, // Nm
  torqueRequiredConstantSpeed: (torqueConstantFriction) => 
    torqueConstantFriction, // Nm
  
  constantRunTime: (moveTime, accelTime, decelTime) =>
    moveTime - accelTime - decelTime, // s
  torqueRmsMotor: (torqueRequiredAcceleration, torqueRequiredDeceleration, torqueRequiredConstantSpeed, accelTime, decelTime, constantRunTime, moveTime, dwellTime) =>
    Math.sqrt((((torqueRequiredAcceleration ** 2) * accelTime) + ((torqueRequiredDeceleration ** 2) * decelTime) + ((torqueRequiredConstantSpeed ** 2) * constantRunTime)) / (dwellTime + moveTime)), // Nm^2
  };


  const conveyorformulas = {
    frictionalForce: (loadMass, frictionCoefficient) => loadMass * frictionCoefficient * 9.81, // N
    inclineForce: (loadMass, inclineAngle) => loadMass * 9.81 * Math.abs(Math.sin(inclineAngle)), // N
    totalForce: (frictionalForce, inclineForce) => frictionalForce + inclineForce, // N
    linearToRotationalSpeed: (beltSpeed, rollerDiameter) => (beltSpeed * 1000) / (Math.PI * rollerDiameter), // RPM
  
    requiredMotorPowerKw: (totalForce, beltSpeed) => (totalForce * beltSpeed) / 1000, // kW
    requiredMotorPowerHp: (totalForce, beltSpeed) => (totalForce * beltSpeed) / 745.7, // hp
    requiredTorque: (totalForce, rollerDiameter) => (totalForce * rollerDiameter) / 2, // Nm
  };

  const genericrotaryformulas = {
    angularSpeed: (requiredSpeedRPM) => (2 * Math.PI * requiredSpeedRPM) / 60, // rad/s
    torqueRequiredAcceleration: (momentOfInertia, angularSpeed, accelTime) => angularSpeed * momentOfInertia / accelTime, // Nm
    torqueRequiredDeceleration: (momentOfInertia, angularSpeed, decelTime) => angularSpeed * momentOfInertia / decelTime, // Nm
    requiredMotorPowerKw : (torque, angularSpeed) => (torque * angularSpeed) / 1000, // kW
    requiredMotorPowerHp : (torque, angularSpeed) => (torque * angularSpeed) / 745.7, // hp
  };

  function calculateContinuousMotorRating(params) {
  const {
    inertia,             // kg·m²
    targetRPM,           // RPM
    accelTime,           // s
    runTime,             // s
    decelTime,           // s
    restTime,            // s
    frictionTorque,      // Nm
    thermalMarginPercent // e.g., 20 = 20%
  } = params;

  const totalCycleTime = accelTime + runTime + decelTime + restTime;
  const g = 9.81;

  // Convert target RPM to rad/s
  const omega = (2 * Math.PI * targetRPM) / 60;

  // Acceleration torque = J * α = J * ω / t
  const accelTorque = inertia * (omega / accelTime);

  // RMS Torque Calculation
  const rmsTorque = Math.sqrt(
    (
      (accelTorque ** 2 * accelTime) +
      (frictionTorque ** 2 * runTime) +
      (frictionTorque ** 2 * decelTime) +
      (0 ** 2 * restTime)
    ) / totalCycleTime
  );

  // Continuous power (W)
  const contPower = rmsTorque * omega;

  // Add thermal margin
  const contPowerWithMargin = contPower * (1 + thermalMarginPercent / 100);

  return {
    omega: omega.toFixed(2) + ' rad/s',
    accelTorque: accelTorque.toFixed(2) + ' Nm',
    rmsTorque: rmsTorque.toFixed(2) + ' Nm',
    contPower: (contPower / 1000).toFixed(2) + ' kW',
    contPowerWithMargin: (contPowerWithMargin / 1000).toFixed(2) + ' kW',
    contPowerHP: (contPower / 745.7).toFixed(2) + ' HP',
    contPowerHPWithMargin: (contPowerWithMargin / 745.7).toFixed(2) + ' HP'
  };
}

function sizeBlowerMotor(params) {
  const {
    airflowCFM,             // CFM
    staticPressureInH2O,           // inH2O
    fanEfficiencyPercent,           // %
    motorEfficiencyPercent,             // %
    rpm = null,           // RPM (optional, for torque calculation)
  } = params;
 
  // Convert inputs to SI units
  const airflow = airflowCFM * 0.0004719;           // m³/s
  const pressure = staticPressureInH2O * 249.1;     // Pa
  const fanEff = fanEfficiencyPercent / 100;        // decimal
  const motorEff = motorEfficiencyPercent / 100;    // decimal

  // Calculate fan power (W)
  const fanPower = (airflow * pressure) / fanEff;

  // Motor shaft power adjusted for efficiency
  const motorPower = fanPower / motorEff;

  // Convert to horsepower
  const motorPowerHP = motorPower / 745.7;

  // Suggest next standard motor size (rounded up)
  const suggestedHP = Math.ceil(motorPowerHP);

  // Optional torque calculation (only if RPM is provided)
  let torqueNm = null;
  if (rpm && rpm > 0) {
    const omega = (2 * Math.PI * rpm) / 60;  // rad/s
    torqueNm = motorPower / omega;
  }

  // Return results
  return {
    fanPowerWatts: (fanPower/1000).toFixed(2) + ' kW',
    motorPowerWatts: (motorPower/1000).toFixed(2) + ' kW',
    motorPowerHP: motorPowerHP.toFixed(2) + '  HP',
    torqueNm: torqueNm ? torqueNm.toFixed(2) + ' Nm': null
  };
}

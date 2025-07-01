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
};

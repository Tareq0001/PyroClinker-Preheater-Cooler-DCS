/**
 * PYRO-CLINKER: Industrial SCADA & Automation Suite Data Types
 * Lead Electrical & Automation Systems Engineer: أ. طارق ابوعشي | Tareq Abuashi
 */

export interface PreheaterCyclone {
  id: string;
  name: string;
  stage: number;
  temperature: number; // °C
  draftPressure: number; // mbar (negative)
  o2Level?: number; // %
  hasAirBlaster?: boolean;
  airBlasterActive?: boolean;
  materialFlowRate: number; // t/h
  status: 'OPTIMAL' | 'ELEVATED' | 'BLOCKED' | 'ALARM';
}

export interface PreheaterTelemetry {
  cyclones: PreheaterCyclone[];
  calciner: {
    temperature: number; // 895 - 920 °C
    draftPressure: number; // -18 mbar
    tertiaryAirTemp: number; // ~820 °C
    fuelFlow: number; // t/h
    calcinationRate: number; // % (e.g. 93.5%)
    flameDetected: boolean;
  };
  kilnInlet: {
    temperature: number; // 1050 - 1120 °C
    draftPressure: number; // -12 mbar
    noxLevel: number; // mg/Nm3
  };
  idFan: {
    speedRpm: number; // e.g. 985 RPM
    damperPercent: number; // 0 - 100%
    motorPowerKw: number; // e.g. 2480 kW (rated 3150 kW)
    motorCurrentA: number; // 6.6 kV current ~265 A
    vibrationMmS: number; // ISO 10816 ~2.1 mm/s
    draftInletMbar: number; // -58 mbar
    bearingTempC: number; // ~62 °C
    isRunning: boolean;
  };
  airBlasterPressureBar: number; // 8.5 Bar
  airBlasterLastFired: string;
  rawMealFeedTph: number; // 240 t/h
}

export interface CoolerFan {
  id: string;
  name: string;
  zone: number;
  flowM3h: number;
  staticPressureMbar: number;
  motorCurrentA: number;
  speedPercent: number;
  vfdFrequencyHz: number;
  status: 'RUNNING' | 'STANDBY' | 'TRIPPED';
}

export interface ClinkerCoolerTelemetry {
  grateSections: {
    id: number;
    name: string;
    clinkerTempC: number;
    strokeRateSpM: number; // 8 - 28 Strokes/min
    drivePressureBar: number; // 145 Bar nominal
    isStalled: boolean;
  }[];
  fans: CoolerFan[];
  hoodDraftPid: {
    sp: number; // -0.80 mbar
    pv: number; // current mbar
    mv: number; // 0 - 100% damper/fan output
    kp: number;
    ti: number;
    td: number;
    autoMode: boolean;
    history: { time: number; sp: number; pv: number; mv: number }[];
  };
  clinkerCrusher: {
    rpm: number;
    loadKw: number;
    clinkerSizeMm: number;
    bearingTempC: number;
    isRunning: boolean;
  };
  snowmanDetected: boolean;
  tertiaryAirTempC: number;
  secondaryAirTempC: number;
  clinkerDischargeTempC: number;
}

export interface BmsCemsTelemetry {
  o2Percent: number; // nominal 2.1%
  coPpm: number; // nominal 250 - 450 ppm
  noxMgNm3: number; // nominal 450 - 680 mg/Nm3
  so2MgNm3: number; // nominal 35 mg/Nm3
  dustMgNm3: number; // nominal 12 mg/Nm3
  
  // Burner Management System (BMS)
  flameIntensityPercent: number; // 98%
  uvScannerActive: boolean;
  irScannerActive: boolean;
  primaryAirPressureMbar: number; // 180 mbar
  fuelShutoffValves: {
    sv101MainBlock: 'OPEN' | 'CLOSED';
    sv102BleedVent: 'OPEN' | 'CLOSED';
    sv103BurnerBlock: 'OPEN' | 'CLOSED';
  };
  espHighVoltageActive: boolean; // Electrostatic Precipitator 80 kV
  espVoltageKv: number; // 80 kV nominal
  highCoTripInterlockActive: boolean;
  coTripCountdownSeconds: number; // 15s timer
  fuelSafetyTripped: boolean;
}

export interface AiPredictiveState {
  shellAxialPoints: { x: number; tempC: number; coatingThicknessMm: number }[];
  maxShellTempC: number;
  hotspotZone: string | null;
  hotspotActive: boolean;
  c4BlockageRiskPercent: number;
  c4BlockageActive: boolean;
  refractoryHealthIndexPercent: number;
  remainingUsefulLifeDays: number;
  anomalyList: string[];
}

export interface SoeEvent {
  id: string;
  timestamp: string; // HH:mm:ss.SSS
  source: string;
  code: string;
  description: string;
  severity: 'NORMAL' | 'WARNING' | 'TRIP' | 'CRITICAL';
}

export interface ActiveFaults {
  c4Plugging: boolean;
  highCoSpike: boolean;
  coolerStall: boolean;
  purgeCycleActive: boolean;
}

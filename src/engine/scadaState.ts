/**
 * PYRO-CLINKER: Central Telemetry & Process Simulation Engine
 * Lead Electrical & Automation Systems Engineer: أ. طارق ابوعشي | Tareq Abuashi
 */

import {
  PreheaterTelemetry,
  ClinkerCoolerTelemetry,
  BmsCemsTelemetry,
  AiPredictiveState,
  SoeEvent,
  ActiveFaults
} from '../types/scada';
import { scadaAudio } from './audioAlarm';

export class ScadaStateManager {
  private listeners: (() => void)[] = [];
  private tickInterval: number | null = null;
  private fastTickInterval: number | null = null;

  // Telemetry Models
  public preheater: PreheaterTelemetry;
  public cooler: ClinkerCoolerTelemetry;
  public bmsCems: BmsCemsTelemetry;
  public aiPredictive: AiPredictiveState;
  public soeLog: SoeEvent[] = [];
  public faults: ActiveFaults = {
    c4Plugging: false,
    highCoSpike: false,
    coolerStall: false,
    purgeCycleActive: false
  };

  public masterStatus: 'NORMAL' | 'WARNING' | 'TRIP' = 'NORMAL';
  public masterMessage: string = 'SYSTEM HEALTHY — 5-STAGE CYCLONE TOWER & COOLER DCS SYNCHRONIZED';
  public soeClockString: string = '00:00:00.000';

  constructor() {
    this.preheater = this.getInitialPreheater();
    this.cooler = this.getInitialCooler();
    this.bmsCems = this.getInitialBmsCems();
    this.aiPredictive = this.getInitialAiPredictive();

    this.addSoe('SYS-INIT', 'DCS-MASTER', 'PYRO-CLINKER DCS Automation Suite initialized nominal baseline', 'NORMAL');
    this.startSimulationLoops();
  }

  private getInitialPreheater(): PreheaterTelemetry {
    return {
      cyclones: [
        { id: 'C1', name: 'Cyclone C1 (Top Dual)', stage: 1, temperature: 312, draftPressure: -56.4, o2Level: 3.4, materialFlowRate: 240, status: 'OPTIMAL' },
        { id: 'C2', name: 'Cyclone C2 Stage', stage: 2, temperature: 494, draftPressure: -42.8, materialFlowRate: 240, status: 'OPTIMAL' },
        { id: 'C3', name: 'Cyclone C3 Stage', stage: 3, temperature: 662, draftPressure: -32.1, materialFlowRate: 240, status: 'OPTIMAL' },
        { id: 'C4', name: 'Cyclone C4 Stage', stage: 4, temperature: 795, draftPressure: -22.4, hasAirBlaster: true, airBlasterActive: false, materialFlowRate: 240, status: 'OPTIMAL' },
        { id: 'C5', name: 'Cyclone C5 Bottom', stage: 5, temperature: 882, draftPressure: -16.8, hasAirBlaster: true, airBlasterActive: false, materialFlowRate: 240, status: 'OPTIMAL' }
      ],
      calciner: {
        temperature: 905,
        draftPressure: -18.2,
        tertiaryAirTemp: 825,
        fuelFlow: 14.2,
        calcinationRate: 93.8,
        flameDetected: true
      },
      kilnInlet: {
        temperature: 1085,
        draftPressure: -12.5,
        noxLevel: 580
      },
      idFan: {
        speedRpm: 985,
        damperPercent: 78,
        motorPowerKw: 2480,
        motorCurrentA: 268,
        vibrationMmS: 2.1,
        draftInletMbar: -58.2,
        bearingTempC: 62.4,
        isRunning: true
      },
      airBlasterPressureBar: 8.5,
      airBlasterLastFired: 'STANDBY',
      rawMealFeedTph: 240
    };
  }

  private getInitialCooler(): ClinkerCoolerTelemetry {
    return {
      grateSections: [
        { id: 1, name: 'Grate Section 1 (Inlet Drop)', clinkerTempC: 1380, strokeRateSpM: 20, drivePressureBar: 145, isStalled: false },
        { id: 2, name: 'Grate Section 2 (Intermediate)', clinkerTempC: 760, strokeRateSpM: 16, drivePressureBar: 142, isStalled: false },
        { id: 3, name: 'Grate Section 3 (Discharge)', clinkerTempC: 98, strokeRateSpM: 13, drivePressureBar: 138, isStalled: false }
      ],
      fans: [
        { id: 'FN-01', name: 'Cooler Fan 1', zone: 1, flowM3h: 42000, staticPressureMbar: 85, motorCurrentA: 215, speedPercent: 88, vfdFrequencyHz: 44.0, status: 'RUNNING' },
        { id: 'FN-02', name: 'Cooler Fan 2', zone: 1, flowM3h: 41500, staticPressureMbar: 84, motorCurrentA: 212, speedPercent: 87, vfdFrequencyHz: 43.5, status: 'RUNNING' },
        { id: 'FN-03', name: 'Cooler Fan 3', zone: 2, flowM3h: 38000, staticPressureMbar: 72, motorCurrentA: 195, speedPercent: 82, vfdFrequencyHz: 41.0, status: 'RUNNING' },
        { id: 'FN-04', name: 'Cooler Fan 4', zone: 2, flowM3h: 37500, staticPressureMbar: 70, motorCurrentA: 192, speedPercent: 81, vfdFrequencyHz: 40.5, status: 'RUNNING' },
        { id: 'FN-05', name: 'Cooler Fan 5', zone: 3, flowM3h: 32000, staticPressureMbar: 58, motorCurrentA: 170, speedPercent: 75, vfdFrequencyHz: 37.5, status: 'RUNNING' },
        { id: 'FN-06', name: 'Cooler Fan 6', zone: 3, flowM3h: 31000, staticPressureMbar: 56, motorCurrentA: 168, speedPercent: 74, vfdFrequencyHz: 37.0, status: 'RUNNING' }
      ],
      hoodDraftPid: {
        sp: -0.80,
        pv: -0.81,
        mv: 64.5,
        kp: 2.4,
        ti: 12.0,
        td: 1.8,
        autoMode: true,
        history: []
      },
      clinkerCrusher: {
        rpm: 38,
        loadKw: 88,
        clinkerSizeMm: 22,
        bearingTempC: 58,
        isRunning: true
      },
      snowmanDetected: false,
      tertiaryAirTempC: 825,
      secondaryAirTempC: 980,
      clinkerDischargeTempC: 98
    };
  }

  private getInitialBmsCems(): BmsCemsTelemetry {
    return {
      o2Percent: 2.1,
      coPpm: 340,
      noxMgNm3: 560,
      so2MgNm3: 32,
      dustMgNm3: 11.5,
      flameIntensityPercent: 98.4,
      uvScannerActive: true,
      irScannerActive: true,
      primaryAirPressureMbar: 182,
      fuelShutoffValves: {
        sv101MainBlock: 'OPEN',
        sv102BleedVent: 'CLOSED',
        sv103BurnerBlock: 'OPEN'
      },
      espHighVoltageActive: true,
      espVoltageKv: 78.5,
      highCoTripInterlockActive: false,
      coTripCountdownSeconds: 15,
      fuelSafetyTripped: false
    };
  }

  private getInitialAiPredictive(): AiPredictiveState {
    const points = [];
    for (let i = 0; i <= 20; i++) {
      const pos = i * 2.5; // meters along calciner and kiln inlet
      // normal baseline temperature 230 - 275 C
      const baseTemp = 240 + Math.sin(i / 2) * 25 + (Math.random() * 8 - 4);
      points.push({
        x: pos,
        tempC: Math.round(baseTemp),
        coatingThicknessMm: Math.round(210 - Math.sin(i / 3) * 35)
      });
    }

    return {
      shellAxialPoints: points,
      maxShellTempC: 278,
      hotspotZone: null,
      hotspotActive: false,
      c4BlockageRiskPercent: 4.2,
      c4BlockageActive: false,
      refractoryHealthIndexPercent: 96.5,
      remainingUsefulLifeDays: 284,
      anomalyList: ['Nominal acoustic vibration profile', 'Refractory thermal boundary verified']
    };
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  private notify() {
    this.listeners.forEach(cb => cb());
  }

  private updateClock() {
    const d = new Date();
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    const s = String(d.getSeconds()).padStart(2, '0');
    const ms = String(d.getMilliseconds()).padStart(3, '0');
    this.soeClockString = `${h}:${m}:${s}.${ms}`;
  }

  public addSoe(code: string, source: string, description: string, severity: 'NORMAL' | 'WARNING' | 'TRIP' | 'CRITICAL') {
    this.updateClock();
    const newEvent: SoeEvent = {
      id: 'SOE-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      timestamp: this.soeClockString,
      source,
      code,
      description,
      severity
    };
    this.soeLog.unshift(newEvent);
    if (this.soeLog.length > 80) {
      this.soeLog.pop();
    }
    this.notify();
  }

  private startSimulationLoops() {
    // 1-second main process cycle
    this.tickInterval = window.setInterval(() => {
      this.updateClock();
      this.simulatePreheaterPhysics();
      this.simulateCoolerAndPidPhysics();
      this.simulateBmsAndCemsGasKinetics();
      this.simulateAiPredictiveDiagnostics();
      this.evaluateMasterAlarms();
      this.notify();
    }, 1000);

    // Fast 100ms PID trend and telemetry jitter
    this.fastTickInterval = window.setInterval(() => {
      this.fastPidIteration();
    }, 100);
  }

  /**
   * Module 1: Preheater & Calciner Physics Simulation
   */
  private simulatePreheaterPhysics() {
    const jitter = (val: number, amp = 0.5) => +(val + (Math.random() * amp * 2 - amp)).toFixed(1);

    // ID Fan draft influence
    const idDamper = this.preheater.idFan.damperPercent;
    const baseInletDraft = -(50 + (idDamper / 100) * 12);
    this.preheater.idFan.draftInletMbar = jitter(baseInletDraft, 0.4);
    this.preheater.idFan.speedRpm = Math.round(980 + (idDamper - 75) * 1.5 + (Math.random() * 4 - 2));
    this.preheater.idFan.motorPowerKw = Math.round(2350 + (idDamper / 100) * 200 + (Math.random() * 10 - 5));

    // Cyclones normal telemetry propagation
    if (!this.faults.c4Plugging) {
      this.preheater.cyclones[0].temperature = jitter(312, 1.2);
      this.preheater.cyclones[0].draftPressure = jitter(this.preheater.idFan.draftInletMbar + 1.8, 0.3);
      this.preheater.cyclones[0].status = 'OPTIMAL';

      this.preheater.cyclones[1].temperature = jitter(494, 1.5);
      this.preheater.cyclones[1].draftPressure = jitter(-42.8 + (100 - idDamper) * 0.1, 0.3);
      this.preheater.cyclones[1].status = 'OPTIMAL';

      this.preheater.cyclones[2].temperature = jitter(662, 1.8);
      this.preheater.cyclones[2].draftPressure = jitter(-32.1 + (100 - idDamper) * 0.08, 0.2);
      this.preheater.cyclones[2].status = 'OPTIMAL';

      this.preheater.cyclones[3].temperature = jitter(795, 2.0);
      this.preheater.cyclones[3].draftPressure = jitter(-22.4, 0.2);
      this.preheater.cyclones[3].status = 'OPTIMAL';
      this.preheater.cyclones[3].materialFlowRate = jitter(240, 2);

      this.preheater.cyclones[4].temperature = jitter(882, 2.0);
      this.preheater.cyclones[4].draftPressure = jitter(-16.8, 0.2);
      this.preheater.cyclones[4].status = 'OPTIMAL';
    } else {
      // C4 PLUGGED FAULT BEHAVIOR
      this.preheater.cyclones[3].status = 'BLOCKED';
      // Draft collapses above blockage, pressure builds beneath
      this.preheater.cyclones[3].draftPressure = jitter(-6.2, 0.5); // drastic draft loss
      this.preheater.cyclones[3].temperature = jitter(845, 3.0); // heat stagnation
      this.preheater.cyclones[3].materialFlowRate = 18; // blocked meal discharge!
      this.preheater.cyclones[2].draftPressure = jitter(-48.5, 0.8); // high vacuum upstream
    }

    // Calciner
    if (this.bmsCems.fuelSafetyTripped) {
      // Fuel shut off! Flame died
      this.preheater.calciner.temperature = Math.max(480, +(this.preheater.calciner.temperature - 6.5).toFixed(1));
      this.preheater.calciner.fuelFlow = 0;
      this.preheater.calciner.calcinationRate = Math.max(12, +(this.preheater.calciner.calcinationRate - 2.8).toFixed(1));
      this.preheater.calciner.flameDetected = false;
    } else {
      this.preheater.calciner.temperature = jitter(905, 2.0);
      this.preheater.calciner.fuelFlow = jitter(14.2, 0.15);
      this.preheater.calciner.calcinationRate = jitter(93.8, 0.2);
      this.preheater.calciner.flameDetected = true;
    }

    // Kiln inlet
    this.preheater.kilnInlet.temperature = jitter(1085, 2.5);
    this.preheater.kilnInlet.draftPressure = jitter(-12.5, 0.2);
  }

  /**
   * Module 2: Reciprocating Grate Cooler & PID Hood Draft Simulation
   */
  private simulateCoolerAndPidPhysics() {
    const jitter = (val: number, amp = 0.5) => +(val + (Math.random() * amp * 2 - amp)).toFixed(1);

    if (this.faults.coolerStall) {
      // Hydraulic drive stall!
      this.cooler.grateSections[0].strokeRateSpM = 0;
      this.cooler.grateSections[0].drivePressureBar = jitter(215, 2.5); // Relief valve lifting!
      this.cooler.grateSections[0].isStalled = true;

      this.cooler.grateSections[1].strokeRateSpM = 0;
      this.cooler.grateSections[1].drivePressureBar = jitter(212, 2.5);
      this.cooler.grateSections[1].isStalled = true;

      this.cooler.grateSections[2].strokeRateSpM = 0;
      this.cooler.grateSections[2].drivePressureBar = jitter(208, 2.0);
      this.cooler.grateSections[2].isStalled = true;

      // Clinker temperature climbs drastically!
      this.cooler.clinkerDischargeTempC = Math.min(365, Math.round(this.cooler.clinkerDischargeTempC + 14));
      this.cooler.grateSections[2].clinkerTempC = this.cooler.clinkerDischargeTempC;
      this.cooler.clinkerCrusher.loadKw = Math.min(132, Math.round(this.cooler.clinkerCrusher.loadKw + 4));
    } else {
      this.cooler.grateSections[0].strokeRateSpM = jitter(20, 0.3);
      this.cooler.grateSections[0].drivePressureBar = jitter(145, 1.2);
      this.cooler.grateSections[0].isStalled = false;

      this.cooler.grateSections[1].strokeRateSpM = jitter(16, 0.2);
      this.cooler.grateSections[1].drivePressureBar = jitter(142, 1.0);
      this.cooler.grateSections[1].isStalled = false;

      this.cooler.grateSections[2].strokeRateSpM = jitter(13, 0.2);
      this.cooler.grateSections[2].drivePressureBar = jitter(138, 1.0);
      this.cooler.grateSections[2].isStalled = false;

      // Cool clinker down to nominal ~98°C
      if (this.cooler.clinkerDischargeTempC > 102) {
        this.cooler.clinkerDischargeTempC = Math.max(98, Math.round(this.cooler.clinkerDischargeTempC - 8));
      } else {
        this.cooler.clinkerDischargeTempC = Math.round(jitter(98, 1.5));
      }
      this.cooler.grateSections[2].clinkerTempC = this.cooler.clinkerDischargeTempC;
      this.cooler.clinkerCrusher.loadKw = Math.round(jitter(88, 2));
    }

    // Cooling fans simulation
    this.cooler.fans.forEach((fan) => {
      fan.flowM3h = Math.round(jitter(fan.flowM3h, 150));
      fan.staticPressureMbar = Math.round(jitter(fan.staticPressureMbar, 0.8));
      fan.motorCurrentA = Math.round(jitter(fan.motorCurrentA, 1.2));
    });
  }

  /**
   * Fast PID Closed-Loop Iteration (100ms) for Kiln Hood Draft
   */
  private fastPidIteration() {
    const pid = this.cooler.hoodDraftPid;
    
    // Natural process noise / draft turbulence
    const disturbance = (Math.random() * 0.06 - 0.03);
    
    // Error calculation e(t) = SP - PV
    const error = pid.sp - (pid.pv + disturbance);

    if (pid.autoMode) {
      // Discrete PID algorithm
      // deltaMV = Kp * e + Ki * int(e) + Kd * de
      const pTerm = pid.kp * error;
      const iTerm = (pid.kp / pid.ti) * error * 0.1;
      const dTerm = pid.kp * pid.td * (error) / 0.1 * 0.05;

      const deltaMv = pTerm + iTerm + dTerm;
      pid.mv = Math.max(5, Math.min(95, pid.mv + deltaMv * 0.4));

      // PV responds to MV (negative relationship: higher exhaust damper opens draft -> lowers pressure)
      const targetPv = pid.sp - (error * 0.72) + disturbance;
      pid.pv = +(targetPv).toFixed(3);
    }

    // Push into history ring buffer (keep last 60 points)
    pid.history.push({
      time: Date.now(),
      sp: pid.sp,
      pv: pid.pv,
      mv: pid.mv
    });

    if (pid.history.length > 60) {
      pid.history.shift();
    }
  }

  /**
   * Module 3: BMS & CEMS Gas Analyzer Kinetics & Trip Interlock
   */
  private simulateBmsAndCemsGasKinetics() {
    const jitter = (val: number, amp = 0.5) => +(val + (Math.random() * amp * 2 - amp)).toFixed(1);

    if (!this.faults.highCoSpike) {
      // Nominal emissions
      if (this.bmsCems.fuelSafetyTripped) {
        this.bmsCems.coPpm = Math.max(45, Math.round(this.bmsCems.coPpm - 60));
        this.bmsCems.o2Percent = Math.min(18.5, jitter(this.bmsCems.o2Percent + 0.8, 0.2));
        this.bmsCems.flameIntensityPercent = 0;
      } else {
        this.bmsCems.coPpm = Math.round(jitter(340, 18));
        this.bmsCems.o2Percent = jitter(2.1, 0.08);
        this.bmsCems.flameIntensityPercent = jitter(98.4, 0.4);
      }
      this.bmsCems.noxMgNm3 = Math.round(jitter(560, 12));
      this.bmsCems.so2MgNm3 = Math.round(jitter(32, 1.5));
      this.bmsCems.highCoTripInterlockActive = false;
      this.bmsCems.coTripCountdownSeconds = 15;
    } else {
      // HIGH CO SPIKE FAULT ACTIVE
      this.bmsCems.coPpm = Math.min(2650, Math.round(this.bmsCems.coPpm + 280));
      this.bmsCems.o2Percent = Math.max(0.4, jitter(this.bmsCems.o2Percent - 0.25, 0.05)); // incomplete combustion!

      // Evaluate 15-second trip countdown if CO > 1500 ppm
      if (this.bmsCems.coPpm > 1500 && !this.bmsCems.fuelSafetyTripped) {
        this.bmsCems.highCoTripInterlockActive = true;
        if (this.bmsCems.coTripCountdownSeconds > 0) {
          this.bmsCems.coTripCountdownSeconds -= 1;
          scadaAudio.playWarningChime();
          this.addSoe(
            'BMS-CO-WARN',
            'CEMS-ANALYZER',
            `High Flue Gas CO=${this.bmsCems.coPpm} ppm > 1500 ppm! Trip Timer: ${this.bmsCems.coTripCountdownSeconds}s remaining`,
            'WARNING'
          );
        } else {
          // COUNTDOWN ZERO: EXECUTE FULL BMS EXPLOSION SAFETY TRIP!
          this.executeBmsTrip();
        }
      }
    }
  }

  /**
   * Execute NFPA 86 / EN 746-2 Explosion Safety Interlock Trip
   */
  private executeBmsTrip() {
    this.bmsCems.fuelSafetyTripped = true;
    this.bmsCems.fuelShutoffValves.sv101MainBlock = 'CLOSED';
    this.bmsCems.fuelShutoffValves.sv102BleedVent = 'OPEN'; // Vent trapped gas to atmosphere
    this.bmsCems.fuelShutoffValves.sv103BurnerBlock = 'CLOSED';
    
    // Trip ESP High Voltage 80kV (elimination of ignition spark in CO-laden atmosphere)
    this.bmsCems.espHighVoltageActive = false;
    this.bmsCems.espVoltageKv = 0;
    this.bmsCems.flameIntensityPercent = 0;

    scadaAudio.playBreakerOperation(false); // VCB trip thump
    scadaAudio.startTripAlarm();

    this.addSoe(
      'ANSI-86-BMS',
      'SAFETY-INTERLOCK',
      'CRITICAL HIGH CO EXPLOSION TRIP! Fuel Double Block & Bleed Closed. ESP 80kV De-energized',
      'CRITICAL'
    );
  }

  /**
   * Module 4: AI Predictive Diagnostics & Thermal Scanner Simulation
   */
  private simulateAiPredictiveDiagnostics() {
    const points = this.aiPredictive.shellAxialPoints;
    let maxTemp = 0;
    const anomalies: string[] = [];

    for (let i = 0; i < points.length; i++) {
      const pt = points[i];
      if (this.faults.highCoSpike || this.faults.c4Plugging) {
        // slight disturbance in shell temperature
        pt.tempC = Math.round(pt.tempC + (Math.random() * 4 - 2));
      }

      // Check for hotspot simulation (at Zone 3 ~ index 7-9)
      if (this.faults.c4Plugging && (i === 7 || i === 8)) {
        pt.tempC = Math.min(418, pt.tempC + 12);
        pt.coatingThicknessMm = Math.max(15, pt.coatingThicknessMm - 6);
      }

      if (pt.tempC > maxTemp) {
        maxTemp = pt.tempC;
      }
    }

    this.aiPredictive.maxShellTempC = maxTemp;

    if (maxTemp > 380) {
      this.aiPredictive.hotspotActive = true;
      this.aiPredictive.hotspotZone = 'Zone 3 (Calciner Transition)';
      anomalies.push(`CRITICAL HOTSPOT: Shell Temp ${maxTemp}°C > 380°C threshold at Zone 3!`);
      this.aiPredictive.refractoryHealthIndexPercent = Math.max(45, Math.round(this.aiPredictive.refractoryHealthIndexPercent - 2.5));
    } else {
      this.aiPredictive.hotspotActive = false;
      this.aiPredictive.hotspotZone = null;
    }

    if (this.faults.c4Plugging) {
      this.aiPredictive.c4BlockageActive = true;
      this.aiPredictive.c4BlockageRiskPercent = 98.7;
      anomalies.push('Cyclone C4 Cone meal bridging / blockage detected via Delta-P divergence');
    } else {
      this.aiPredictive.c4BlockageActive = false;
      this.aiPredictive.c4BlockageRiskPercent = 4.2;
    }

    if (this.faults.coolerStall) {
      anomalies.push('Cooler Grate Drive Hydraulic Relief Limit exceeded (215 Bar)');
    }

    if (anomalies.length === 0) {
      anomalies.push('Refractory coating thickness within nominal acoustic limits');
      anomalies.push('Gas-solid velocity profile balanced across C1-C5 stages');
    }

    this.aiPredictive.anomalyList = anomalies;
  }

  /**
   * Evaluate Global Master Annunciator Status
   */
  private evaluateMasterAlarms() {
    if (this.bmsCems.fuelSafetyTripped) {
      this.masterStatus = 'TRIP';
      this.masterMessage = 'EMERGENCY BMS TRIP: HIGH CO EXCEEDED 1500 PPM — ESP 80kV DE-ENERGIZED & FUEL ISOLATED';
    } else if (this.faults.highCoSpike) {
      this.masterStatus = 'TRIP';
      this.masterMessage = `DANGER: HIGH CO SPIKE (${this.bmsCems.coPpm} PPM) — BMS INTERLOCK TIMEOUT: ${this.bmsCems.coTripCountdownSeconds}s`;
    } else if (this.faults.coolerStall) {
      this.masterStatus = 'WARNING';
      this.masterMessage = 'COOLER HYDRAULIC STALL: Grates halted, hydraulic pressure 215 Bar, clinker temp rising';
    } else if (this.faults.c4Plugging) {
      this.masterStatus = 'WARNING';
      this.masterMessage = 'PREHEATER C4 BLOCKAGE: Cyclone C4 cone plugged, delta-P collapsed, firing air blasters';
    } else {
      this.masterStatus = 'NORMAL';
      this.masterMessage = 'SYSTEM HEALTHY — 5-STAGE CYCLONE TOWER & COOLER DCS SYNCHRONIZED';
      scadaAudio.stopAlarm();
    }
  }

  // =========================================================================
  // FAULT INJECTION CONTROLLERS (Module 5)
  // =========================================================================

  /**
   * Fault 1: Simulate Cyclone C4 Plugging & Automatic Air Blaster Burst
   */
  public triggerC4Plugging() {
    scadaAudio.playClick();
    this.faults.c4Plugging = true;
    this.addSoe('C4-BLK-01', 'CYCLONE-C4', 'Cyclone C4 cone meal blockage detected (Delta-P dropped to -6.2 mbar)', 'WARNING');

    // Auto-fire Air Blaster after 1.5 seconds
    window.setTimeout(() => {
      this.fireAirBlaster(true);
    }, 1500);
  }

  /**
   * Fire High-Pressure Air Blaster Cannons (8.5 Bar)
   */
  public fireAirBlaster(autoCleared = false) {
    scadaAudio.playAirBlasterBlast();
    this.preheater.cyclones[3].airBlasterActive = true;
    this.preheater.cyclones[4].airBlasterActive = true;
    this.preheater.airBlasterLastFired = 'FIRED 8.5 BAR PULSE';

    this.addSoe('AB-PULSE', 'AIR-CANNON', 'Air Blaster Cannons 8.5 Bar discharged onto C4/C5 cones', 'NORMAL');

    window.setTimeout(() => {
      this.preheater.cyclones[3].airBlasterActive = false;
      this.preheater.cyclones[4].airBlasterActive = false;
      this.preheater.airBlasterLastFired = 'STANDBY';
      if (autoCleared && this.faults.c4Plugging) {
        this.faults.c4Plugging = false;
        this.addSoe('C4-CLR', 'CYCLONE-C4', 'C4 cone blockage cleared by pneumatic air cannon shock wave', 'NORMAL');
        scadaAudio.playWarningChime();
      }
      this.notify();
    }, 2000);
  }

  /**
   * Fault 2: Simulate High CO Spike (> 2000 ppm)
   */
  public triggerHighCoSpike() {
    scadaAudio.playClick();
    this.faults.highCoSpike = true;
    this.bmsCems.coPpm = 2050;
    this.bmsCems.coTripCountdownSeconds = 15;
    this.addSoe('CEMS-CO-HI', 'CEMS-ANALYZER', 'High CO spike injected: CO=2050 ppm exceeds 1500 ppm threshold', 'WARNING');
  }

  /**
   * Fault 3: Simulate Cooler Grate Hydraulic Stall
   */
  public triggerCoolerStall() {
    scadaAudio.playClick();
    this.faults.coolerStall = true;
    scadaAudio.playWarningChime();
    this.addSoe('CLR-STALL', 'HYD-SYSTEM', 'Cooler hydraulic drive relief overload (215 Bar), grates stalled', 'TRIP');
  }

  /**
   * Fault 4: Emergency Reset & Purge Cycle
   */
  public triggerEmergencyResetAndPurge() {
    scadaAudio.playClick();
    scadaAudio.playGasPurge();
    this.faults.purgeCycleActive = true;
    this.addSoe('PURGE-SEQ', 'BMS-RESET', 'Emergency Reset & Nitrogen Purge cycle initiated (EN 746-2)', 'NORMAL');

    window.setTimeout(() => {
      // Reset all faults
      this.faults.c4Plugging = false;
      this.faults.highCoSpike = false;
      this.faults.coolerStall = false;
      this.faults.purgeCycleActive = false;

      // Reset BMS
      this.bmsCems.fuelSafetyTripped = false;
      this.bmsCems.highCoTripInterlockActive = false;
      this.bmsCems.coTripCountdownSeconds = 15;
      this.bmsCems.coPpm = 310;
      this.bmsCems.o2Percent = 2.1;
      this.bmsCems.fuelShutoffValves.sv101MainBlock = 'OPEN';
      this.bmsCems.fuelShutoffValves.sv102BleedVent = 'CLOSED';
      this.bmsCems.fuelShutoffValves.sv103BurnerBlock = 'OPEN';
      this.bmsCems.espHighVoltageActive = true;
      this.bmsCems.espVoltageKv = 78.5;
      this.bmsCems.flameIntensityPercent = 98.2;

      // Re-energize ESP
      scadaAudio.playBreakerOperation(true); // VCB close thump
      scadaAudio.stopAlarm();

      // Reset cooler
      this.cooler.clinkerDischargeTempC = 98;
      this.cooler.grateSections.forEach(g => {
        g.isStalled = false;
        g.drivePressureBar = 145;
      });

      // Reset AI
      this.aiPredictive.refractoryHealthIndexPercent = 98.0;
      this.aiPredictive.hotspotActive = false;

      this.addSoe('SYS-RST', 'OPERATOR', 'Master Reset complete: BMS armed, ESP energized, nominal parameters restored', 'NORMAL');
      this.notify();
    }, 2200);
  }

  /**
   * Change ID Fan Damper
   */
  public setIdFanDamper(percent: number) {
    this.preheater.idFan.damperPercent = Math.max(0, Math.min(100, percent));
    this.notify();
  }

  /**
   * Change Hood Draft PID Setpoint
   */
  public setHoodDraftSp(sp: number) {
    this.cooler.hoodDraftPid.sp = +sp.toFixed(2);
    this.notify();
  }
}

export const scadaState = new ScadaStateManager();

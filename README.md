# PYRO-CLINKER: 5-Stage Preheater Tower, Calciner DCS & Clinker Cooler Automation Suite

![SCADA Banner](https://img.shields.io/badge/DCS-v5.2_Production-0284c7?style=for-the-badge&logo=shield)
![Safety SIL-2](https://img.shields.io/badge/Functional_Safety-SIL--2_%2F_IEC_61508-10b981?style=for-the-badge)
![Combustion NFPA-86](https://img.shields.io/badge/Combustion_Safety-NFPA_86_%2F_EN_746--2-f59e0b?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8_Strict-3178c6?style=for-the-badge&logo=typescript)

---

### Lead Electrical & Automation Systems Engineer
**أ. طارق ابوعشي | Tareq Abuashi**  
*Lead Electrical, Instrumentation & Automation Systems Engineer*  
*Specialist in Industrial SCADA/DCS Architectures, Functional Safety & Process Analytics*

---

## 1. Executive Process Summary

**PYRO-CLINKER** is a mission-critical industrial Distributed Control System (DCS) and human-machine interface (HMI) digital twin designed for modern cement plant pyroprocessing lines. The automation suite replicates thermodynamics, gas kinetics, fluid dynamics, and electrical interlocks across a 3,850 Metric Tons Per Day (TPD) clinker production line with five integrated engineering modules:

1. **5-Stage Cyclone Suspension Preheater Tower & Calciner Telemetry**
2. **Reciprocating Grate Cooler & Closed-Loop PID Kiln Hood Draft Control**
3. **Burner Management System (BMS) & CEMS Flue Gas Emission Analyzer**
4. **AI Predictive Refractory Lining Scanner & Shell Thermal Profile (60 FPS Canvas)**
5. **Interactive Fault Injection Simulator & Sequence of Events (SOE) Chronometer**

---

## 2. Engineering Architecture & Modules

### Module 1: 5-Stage Cyclone Preheater & Calciner Telemetry
- **5-Stage Cyclone Geometry (C1 to C5):** Real-time counterflow simulation where hot gases from the kiln rise through cyclones C5 to C1 while raw meal gravity-descends in counter-current fashion, achieving up to 94% heat exchange efficiency.
- **Precalciner Vessel:** Models endothermic calcium carbonate decarbonization ($CaCO_3 \rightarrow CaO + CO_2$) at temperatures between $895^\circ\text{C}$ and $920^\circ\text{C}$ with live burner flame simulation and tertiary air offtake ($825^\circ\text{C}$).
- **Preheater ID Fan:** $6.6\text{ kV} - 3150\text{ kW}$ medium-voltage variable-speed induced draft fan with modulated inlet damper ($0-100\%$), current readouts, bearing temperatures, and static negative pressures ($-12\text{ mbar}$ up to $-58\text{ mbar}$).
- **Air Blaster Manifold (8.5 Bar):** High-pressure pneumatic impulse cannons (AB-41 & AB-51) installed at cyclone C4 and C5 cones to shatter sticky alkali/sulfur meal build-ups and clear bridging.

### Module 2: Reciprocating Grate Cooler & PID Kiln Hood Draft Control
- **3-Section Reciprocating Grates:** Quenches clinker rapidly from $1400^\circ\text{C}$ down to $95^\circ\text{C}$ using 3 independently driven hydraulic grate sections with stroke rates of $8 - 28\text{ Strokes/min}$ and hydraulic drive pressure of $145\text{ Bar}$.
- **6 Under-Grate Aeration Fans (FN-01 to FN-06):** $400\text{V} - 250\text{ kW}$ VFD-driven fans delivering optimized high-pressure cooling air through compartmented aeration beams.
- **Closed-Loop PID Kiln Hood Draft Controller:** Strict negative draft regulation around setpoint $SP = -0.80\text{ mbar}$ using discrete PID control laws with anti-windup and real-time SVG mini-trend visualization.
- **Clinker Crusher & Snowman Detection:** Clinker clinker roller crusher ($38\text{ RPM}, 88\text{ kW}$) and acoustic/optical sensor beam monitoring clinker build-up ("Snowman") at the kiln drop chute.

### Module 3: Burner Management System (BMS) & CEMS Flue Gas Analyzer
- **CEMS Gas Analytics:** Continuous emission measurement of Oxygen ($O_2: 2.1\%$), Carbon Monoxide ($CO: 250 - 2500\text{ ppm}$), Nitrogen Oxides ($NO_x: 560\text{ mg/Nm}^3$), and Sulfur Dioxide ($SO_2: 32\text{ mg/Nm}^3$).
- **NFPA 86 / EN 746-2 High CO Explosion Prevention Interlock:**
  * Warning threshold at $CO > 1000\text{ ppm}$.
  * Critical trip arming at $CO > 1500\text{ ppm}$ activating a **15-second fail-safe countdown timer**.
  * Upon timeout: trips fuel supply via pneumatic spring-return Double Block & Bleed valves ($SV-101$ Closed, $SV-102$ Bleed Vent Open, $SV-103$ Closed) and de-energizes the **Electrostatic Precipitator (ESP) 80 kV** bus to prevent spark ignition in an explosive gas atmosphere.
- **Flame Safeguard:** Self-checking dual optical UV and IR flame scanners ($98.4\%$ flame quality index).

### Module 4: AI Predictive Refractory Scanner & Thermal Profile
- **60 FPS HTML5 Canvas Infrared Scanner:** Real-time multi-point axial infrared surface thermography unwrapping the cylindrical calciner and kiln inlet shell.
- **Refractory Coating Profile:** Continuous tracking of protective clinker coating and brick thickness ($0 - 250\text{ mm}$).
- **Anomaly Detection:**
  * *Zone 3 Hotspot Warning ($> 380^\circ\text{C}$)* indicating brick spalling or loss of coating.
  * *Cyclone C4 Cone Blockage Risk ($> 90\%$)* calculated via static delta-P divergence.
  * *Remaining Useful Life (RUL)* estimation and refractory health index.

### Module 5: Fault Injection & Sequence of Events (SOE) Chronometer
- **`[Simulate Cyclone C4 Plugging]`:** Induces pressure collapse in C4, triggering automated firing of 8.5 Bar air blaster cannons with realistic acoustic shockwave discharge.
- **`[Simulate High CO Spike (>2000 ppm)]`:** Spikes combustible CO above 2000 ppm, initiating the 15-second explosion safety countdown, resulting in full BMS fuel trip and ESP 80kV de-energization.
- **`[Simulate Cooler Grate Hydraulic Stall]`:** Simulates hydraulic relief valve overload (215 Bar), halting grate motion and causing clinker discharge temperature to surge.
- **`[Emergency Reset & Purge Cycle]`:** Automated NFPA 86 purge sequence that vents gas lines, re-arms safety interlocks, closes ESP vacuum circuit breakers, and returns telemetry to baseline.
- **High-Speed SOE Event Logger:** Millisecond-accurate timestamping ($HH:mm:ss.SSS$) with severity classification and one-click CSV export.

---

## 3. Acoustic Engineering: Web Audio API Synthesizer

The suite features an integrated hardware-accelerated sound synthesizer running via the browser's native `AudioContext`:
- **Master Emergency Siren:** Sawtooth oscillator sweeping between $1050\text{ Hz}$ and $550\text{ Hz}$ with lowpass biquad filtering.
- **Vacuum Circuit Breaker (VCB) Thump:** Sub-bass triangle impact ($95\text{ Hz} \rightarrow 28\text{ Hz}$) combined with filtered white noise contact snap.
- **8.5 Bar Pneumatic Air Blaster Blast:** Sub-bass detonation combined with bandpass-filtered turbulent air rush ($800\text{ Hz} \rightarrow 320\text{ Hz}$).
- **Nitrogen Purge Acoustic Hiss:** Ambient white noise bandpass filter simulating high-velocity nitrogen pipeline sweeping.

---

## 4. Technical Specifications & Stack

| Parameter | Specification |
|---|---|
| **Core Architecture** | Pure TypeScript 5.8 (Strict Type Checking) |
| **Build Tool** | Vite 6 (Zero-Bloat Native Bundler) |
| **Graphics Engine** | Animated Responsive Vector Graphics (SVG) + HTML5 2D Canvas (60 FPS) |
| **Audio Engine** | Web Audio API Real-Time DSP Synthesizer |
| **Safety Standards** | IEC 61508 (SIL-2), NFPA 86, EN 746-2, ISO 10816 |
| **Deployment Mode** | Static Relative Bundled Distributable (`base: './'`) |

---

## 5. Local Development & Build Verification

```bash
# Navigate to the project root
cd C:\Users\abuos\.gemini\antigravity\scratch\PyroClinker-Preheater-Cooler-DCS

# Compile TypeScript and build production bundle
npm run build

# Preview locally
npm run preview
```

---

## 6. Engineering Credentials & License

Developed and engineered by:  
**أ. طارق ابوعشي | Tareq Abuashi**  
*Lead Electrical & Automation Systems Engineer*  
*Specialist in Industrial Automation, Process Control Systems & High-Reliability SCADA*

All industrial logic, mathematical formulations, SVG mimics, and UI designs are proprietary engineering work.

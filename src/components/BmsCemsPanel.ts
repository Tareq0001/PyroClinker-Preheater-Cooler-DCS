/**
 * PYRO-CLINKER: Burner Management System (BMS) & CEMS Gas Analyzer Component
 * Lead Electrical & Automation Systems Engineer: أ. طارق ابوعشي | Tareq Abuashi
 */

import { ScadaStateManager } from '../engine/scadaState';

export class BmsCemsPanel {
  private container: HTMLElement;
  private state: ScadaStateManager;

  constructor(containerId: string, state: ScadaStateManager) {
    const el = document.getElementById(containerId);
    if (!el) throw new Error(`Container #${containerId} not found`);
    this.container = el;
    this.state = state;
    this.render();
    this.state.subscribe(() => this.updateTelemetry());
  }

  private render() {
    this.container.innerHTML = `
      <div class="bms-cems-panel">
        <div class="panel-header">
          <div class="panel-title">
            <i class="fa-solid fa-fire-burner text-amber"></i>
            <span>BMS BURNER MANAGEMENT & CEMS FLUE GAS ANALYZER</span>
          </div>
          <div class="panel-badges">
            <span class="badge badge-success" id="esp-status-badge">ESP 80kV: ENERGIZED</span>
            <span class="badge badge-info" id="flame-status-badge">FLAME: 98.4% (DUAL UV/IR)</span>
          </div>
        </div>

        <div class="bms-cems-grid">
          <!-- CEMS Gas Telemetry Card -->
          <div class="cems-card">
            <div class="subcard-header">
              <span class="subcard-title"><i class="fa-solid fa-smog text-cyan"></i> CEMS Flue Gas Emission Telemetry</span>
              <span class="text-xs font-mono text-muted">Sampling: Kiln Inlet & C1 Exit</span>
            </div>

            <div class="cems-metrics-grid">
              <!-- O2 -->
              <div class="gas-metric-box">
                <div class="gas-meta">
                  <span class="gas-name">OXYGEN (O2)</span>
                  <span class="gas-limit text-muted">Setpoint: 2.0 - 2.5%</span>
                </div>
                <div class="gas-value-row">
                  <span class="gas-num font-mono text-cyan" id="cems-o2-val">2.1 %</span>
                  <span class="gas-status-pill pill-normal">OPTIMAL</span>
                </div>
                <div class="gas-bar-bg">
                  <div class="gas-bar-fill fill-cyan" id="bar-o2" style="width: 21%;"></div>
                </div>
              </div>

              <!-- CO with Critical Interlock Highlight -->
              <div class="gas-metric-box" id="box-co-metric">
                <div class="gas-meta">
                  <span class="gas-name">CARBON MONOXIDE (CO)</span>
                  <span class="gas-limit text-amber">Trip Limit: 1500 ppm</span>
                </div>
                <div class="gas-value-row">
                  <span class="gas-num font-mono text-green" id="cems-co-val">340 ppm</span>
                  <span class="gas-status-pill pill-normal" id="cems-co-pill">NORMAL</span>
                </div>
                <div class="gas-bar-bg">
                  <div class="gas-bar-fill fill-green" id="bar-co" style="width: 14%;"></div>
                </div>
              </div>

              <!-- NOx -->
              <div class="gas-metric-box">
                <div class="gas-meta">
                  <span class="gas-name">NITROGEN OXIDES (NOx)</span>
                  <span class="gas-limit text-muted">Limit: 800 mg/Nm³</span>
                </div>
                <div class="gas-value-row">
                  <span class="gas-num font-mono text-muted" id="cems-nox-val">560 mg/Nm³</span>
                  <span class="gas-status-pill pill-normal">COMPLIANT</span>
                </div>
                <div class="gas-bar-bg">
                  <div class="gas-bar-fill fill-amber" id="bar-nox" style="width: 70%;"></div>
                </div>
              </div>

              <!-- SO2 -->
              <div class="gas-metric-box">
                <div class="gas-meta">
                  <span class="gas-name">SULFUR DIOXIDE (SO2)</span>
                  <span class="gas-limit text-muted">Limit: 200 mg/Nm³</span>
                </div>
                <div class="gas-value-row">
                  <span class="gas-num font-mono text-muted" id="cems-so2-val">32 mg/Nm³</span>
                  <span class="gas-status-pill pill-normal">LOW</span>
                </div>
                <div class="gas-bar-bg">
                  <div class="gas-bar-fill fill-cyan" id="bar-so2" style="width: 16%;"></div>
                </div>
              </div>
            </div>

            <!-- High CO Countdown Banner (Hidden until triggered) -->
            <div class="co-countdown-banner" id="co-countdown-banner" style="display: none;">
              <div class="countdown-pulse-icon">
                <i class="fa-solid fa-triangle-exclamation text-red"></i>
              </div>
              <div class="countdown-content">
                <div class="countdown-title text-red font-bold">
                  HIGH FLUE GAS CO TRIP INTERLOCK ARMED!
                </div>
                <div class="countdown-desc text-xs text-muted">
                  CO level exceeds 1500 ppm explosion threshold (NFPA 86 / EN 746-2). Automatic ESP power cutoff & fuel trip countdown:
                </div>
              </div>
              <div class="countdown-timer font-mono text-red" id="co-countdown-timer">
                15s
              </div>
            </div>
          </div>

          <!-- BMS Safety & Fuel Shutoff Train Card -->
          <div class="bms-card">
            <div class="subcard-header">
              <span class="subcard-title"><i class="fa-solid fa-shield-halved text-amber"></i> BMS Safety Fuel Train & Flame Interlocks</span>
              <span class="text-xs font-mono text-muted">ANSI 86 / NFPA 86 Certified</span>
            </div>

            <!-- Double Block & Bleed Visual Schematic -->
            <div class="dbb-schematic-wrap">
              <span class="dbb-title">FUEL TRAIN: DOUBLE BLOCK & BLEED (DB&B) SAFETY VALVES</span>
              <div class="dbb-flow-line">
                <!-- Supply Point -->
                <div class="dbb-node">
                  <span class="node-label">FUEL SUPPLY</span>
                  <i class="fa-solid fa-gas-pump text-cyan"></i>
                </div>

                <div class="pipe-segment"></div>

                <!-- SV-101: Main Block Valve -->
                <div class="valve-box" id="valve-sv101">
                  <span class="valve-tag">SV-101</span>
                  <div class="valve-icon-wrap open" id="icon-sv101">
                    <i class="fa-solid fa-circle-dot"></i>
                  </div>
                  <span class="valve-state font-mono text-green" id="txt-sv101">OPEN</span>
                  <span class="valve-desc text-muted">Main Block</span>
                </div>

                <!-- Bleed Vent Tee -->
                <div class="bleed-tee-wrap">
                  <div class="pipe-segment"></div>
                  <!-- Vertical Bleed Pipe to SV-102 -->
                  <div class="bleed-pipe-up">
                    <div class="valve-box vertical" id="valve-sv102">
                      <span class="valve-tag">SV-102</span>
                      <div class="valve-icon-wrap closed" id="icon-sv102">
                        <i class="fa-solid fa-xmark"></i>
                      </div>
                      <span class="valve-state font-mono text-green" id="txt-sv102">CLOSED</span>
                      <span class="valve-desc text-muted">Bleed Vent</span>
                    </div>
                  </div>
                </div>

                <div class="pipe-segment"></div>

                <!-- SV-103: Burner Block Valve -->
                <div class="valve-box" id="valve-sv103">
                  <span class="valve-tag">SV-103</span>
                  <div class="valve-icon-wrap open" id="icon-sv103">
                    <i class="fa-solid fa-circle-dot"></i>
                  </div>
                  <span class="valve-state font-mono text-green" id="txt-sv103">OPEN</span>
                  <span class="valve-desc text-muted">Burner Block</span>
                </div>

                <div class="pipe-segment"></div>

                <!-- Burner Head -->
                <div class="dbb-node burner">
                  <span class="node-label">KILN MAIN BURNER</span>
                  <i class="fa-solid fa-fire text-amber"></i>
                </div>
              </div>
            </div>

            <!-- Optical Flame Scanners & ESP High Voltage Safety -->
            <div class="bms-subs-grid">
              <div class="bms-sub-box">
                <span class="sub-label">OPTICAL FLAME SCANNERS</span>
                <div class="scanner-status-row">
                  <span class="scanner-item"><i class="fa-solid fa-eye text-cyan"></i> UV SCANNER: <b>ACTIVE (98%)</b></span>
                  <span class="scanner-item"><i class="fa-solid fa-bullseye text-amber"></i> IR SCANNER: <b>ACTIVE (99%)</b></span>
                </div>
                <span class="text-xs text-muted">Self-checking optical shutter frequency 1 Hz</span>
              </div>

              <div class="bms-sub-box">
                <span class="sub-label">ELECTROSTATIC PRECIPITATOR (ESP)</span>
                <div class="esp-status-row">
                  <span class="font-mono text-cyan" id="bms-esp-kv">80 kV BUS: 78.5 kV</span>
                  <span class="badge badge-success" id="bms-esp-badge">ENERGIZED</span>
                </div>
                <span class="text-xs text-muted">Auto-tripped on High CO (>1500 ppm) to prevent arc ignition</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private updateTelemetry() {
    const bms = this.state.bmsCems;

    // CEMS Readouts
    const o2El = document.getElementById('cems-o2-val');
    if (o2El) o2El.textContent = `${bms.o2Percent.toFixed(1)} %`;

    const barO2 = document.getElementById('bar-o2');
    if (barO2) barO2.style.width = `${Math.min(100, bms.o2Percent * 10)}%`;

    const coEl = document.getElementById('cems-co-val');
    const coPill = document.getElementById('cems-co-pill');
    const barCo = document.getElementById('bar-co');
    if (coEl && coPill && barCo) {
      coEl.textContent = `${bms.coPpm} ppm`;
      const pct = Math.min(100, (bms.coPpm / 2500) * 100);
      barCo.style.width = `${pct}%`;

      if (bms.coPpm > 1500) {
        coEl.className = 'gas-num font-mono text-red font-bold';
        coPill.textContent = 'EXPLOSION RISK';
        coPill.className = 'gas-status-pill pill-danger';
        barCo.className = 'gas-bar-fill fill-red';
      } else if (bms.coPpm > 1000) {
        coEl.className = 'gas-num font-mono text-amber font-bold';
        coPill.textContent = 'ELEVATED';
        coPill.className = 'gas-status-pill pill-warning';
        barCo.className = 'gas-bar-fill fill-amber';
      } else {
        coEl.className = 'gas-num font-mono text-green';
        coPill.textContent = 'NORMAL';
        coPill.className = 'gas-status-pill pill-normal';
        barCo.className = 'gas-bar-fill fill-green';
      }
    }

    const noxEl = document.getElementById('cems-nox-val');
    if (noxEl) noxEl.textContent = `${bms.noxMgNm3} mg/Nm³`;

    const so2El = document.getElementById('cems-so2-val');
    if (so2El) so2El.textContent = `${bms.so2MgNm3} mg/Nm³`;

    // 15-second countdown display
    const countdownBanner = document.getElementById('co-countdown-banner');
    const countdownTimer = document.getElementById('co-countdown-timer');
    if (countdownBanner && countdownTimer) {
      if (bms.highCoTripInterlockActive && !bms.fuelSafetyTripped) {
        countdownBanner.style.display = 'flex';
        countdownTimer.textContent = `${bms.coTripCountdownSeconds}s`;
      } else {
        countdownBanner.style.display = 'none';
      }
    }

    // Double block & bleed valve states
    const iconSv101 = document.getElementById('icon-sv101');
    const txtSv101 = document.getElementById('txt-sv101');
    if (iconSv101 && txtSv101) {
      const isOpen = bms.fuelShutoffValves.sv101MainBlock === 'OPEN';
      iconSv101.className = `valve-icon-wrap ${isOpen ? 'open' : 'closed'}`;
      txtSv101.textContent = bms.fuelShutoffValves.sv101MainBlock;
      txtSv101.className = `valve-state font-mono ${isOpen ? 'text-green' : 'text-red font-bold'}`;
    }

    const iconSv102 = document.getElementById('icon-sv102');
    const txtSv102 = document.getElementById('txt-sv102');
    if (iconSv102 && txtSv102) {
      const isOpen = bms.fuelShutoffValves.sv102BleedVent === 'OPEN';
      iconSv102.className = `valve-icon-wrap ${isOpen ? 'venting' : 'closed'}`;
      txtSv102.textContent = bms.fuelShutoffValves.sv102BleedVent;
      txtSv102.className = `valve-state font-mono ${isOpen ? 'text-amber font-bold' : 'text-green'}`;
    }

    const iconSv103 = document.getElementById('icon-sv103');
    const txtSv103 = document.getElementById('txt-sv103');
    if (iconSv103 && txtSv103) {
      const isOpen = bms.fuelShutoffValves.sv103BurnerBlock === 'OPEN';
      iconSv103.className = `valve-icon-wrap ${isOpen ? 'open' : 'closed'}`;
      txtSv103.textContent = bms.fuelShutoffValves.sv103BurnerBlock;
      txtSv103.className = `valve-state font-mono ${isOpen ? 'text-green' : 'text-red font-bold'}`;
    }

    // ESP 80kV Status
    const espBadge = document.getElementById('esp-status-badge');
    const bmsEspKv = document.getElementById('bms-esp-kv');
    const bmsEspBadge = document.getElementById('bms-esp-badge');
    if (espBadge && bmsEspKv && bmsEspBadge) {
      if (bms.espHighVoltageActive) {
        espBadge.textContent = 'ESP 80kV: ENERGIZED';
        espBadge.className = 'badge badge-success';
        bmsEspKv.textContent = `80 kV BUS: ${bms.espVoltageKv} kV`;
        bmsEspBadge.textContent = 'ENERGIZED';
        bmsEspBadge.className = 'badge badge-success';
      } else {
        espBadge.textContent = 'ESP 80kV: TRIPPED DE-ENERGIZED';
        espBadge.className = 'badge badge-danger font-bold';
        bmsEspKv.textContent = '80 kV BUS: 0.0 kV';
        bmsEspBadge.textContent = 'TRIPPED (ISOLATED)';
        bmsEspBadge.className = 'badge badge-danger';
      }
    }

    // Flame badge
    const flameBadge = document.getElementById('flame-status-badge');
    if (flameBadge) {
      if (bms.flameIntensityPercent > 50) {
        flameBadge.textContent = `FLAME: ${bms.flameIntensityPercent}% (DUAL UV/IR)`;
        flameBadge.className = 'badge badge-info';
      } else {
        flameBadge.textContent = 'FLAME: EXTINGUISHED';
        flameBadge.className = 'badge badge-danger';
      }
    }
  }
}

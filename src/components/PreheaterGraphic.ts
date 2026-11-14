/**
 * PYRO-CLINKER: 5-Stage Cyclone Preheater & Calciner SVG Telemetry Component
 * Lead Electrical & Automation Systems Engineer: أ. طارق ابوعشي | Tareq Abuashi
 */

import { ScadaStateManager } from '../engine/scadaState';

export class PreheaterGraphic {
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
      <div class="preheater-panel">
        <div class="panel-header">
          <div class="panel-title">
            <i class="fa-solid fa-tower-observation text-cyan"></i>
            <span>5-STAGE CYCLONE PREHEATER TOWER & PRECALCINER MIMIC</span>
          </div>
          <div class="panel-badges">
            <span class="badge badge-info" id="ph-meal-feed">RAW MEAL: 240 t/h</span>
            <span class="badge badge-warning" id="ph-blaster-status">AIR BLASTERS: 8.5 BAR</span>
            <span class="badge badge-cyan" id="ph-fan-kw">ID FAN: 2480 kW</span>
          </div>
        </div>

        <div class="preheater-svg-wrap">
          <svg class="preheater-svg" viewBox="0 0 920 620" preserveAspectRatio="xMidYMid meet">
            <defs>
              <!-- Gradients for Cyclone Stages -->
              <linearGradient id="gradC1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#1e293b"/>
                <stop offset="100%" stop-color="#0f172a"/>
              </linearGradient>
              <linearGradient id="gradC2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#334155"/>
                <stop offset="100%" stop-color="#1e293b"/>
              </linearGradient>
              <linearGradient id="gradC3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#475569"/>
                <stop offset="100%" stop-color="#334155"/>
              </linearGradient>
              <linearGradient id="gradC4" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#78350f"/>
                <stop offset="100%" stop-color="#451a03"/>
              </linearGradient>
              <linearGradient id="gradC5" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#9a3412"/>
                <stop offset="100%" stop-color="#7c2d12"/>
              </linearGradient>
              <linearGradient id="gradCalciner" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#ea580c"/>
                <stop offset="50%" stop-color="#dc2626"/>
                <stop offset="100%" stop-color="#7f1d1d"/>
              </linearGradient>

              <!-- Flame Filter -->
              <filter id="flame-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <!-- Shockwave pulse for Air Blaster -->
              <radialGradient id="blastWave">
                <stop offset="0%" stop-color="rgba(56, 189, 248, 0.9)"/>
                <stop offset="50%" stop-color="rgba(14, 165, 233, 0.4)"/>
                <stop offset="100%" stop-color="rgba(2, 132, 199, 0)"/>
              </radialGradient>
            </defs>

            <!-- Preheater Tower Structural Steel Framework -->
            <g class="tower-framework" stroke="#1e293b" stroke-width="2" opacity="0.4">
              <line x1="80" y1="40" x2="80" y2="580"/>
              <line x1="280" y1="40" x2="280" y2="580"/>
              <line x1="480" y1="40" x2="480" y2="580"/>
              <line x1="680" y1="40" x2="680" y2="580"/>
              <!-- Cross bracing -->
              <line x1="80" y1="120" x2="680" y2="120"/>
              <line x1="80" y1="230" x2="680" y2="230"/>
              <line x1="80" y1="340" x2="680" y2="340"/>
              <line x1="80" y1="450" x2="680" y2="450"/>
              <line x1="80" y1="560" x2="680" y2="560"/>
            </g>

            <!-- Gas Ducts (Connecting Stages) -->
            <!-- C1 to ID Fan Duct -->
            <path d="M 230 70 L 150 70 L 150 130 L 100 130" fill="none" stroke="#38bdf8" stroke-width="8" stroke-dasharray="6,4" class="gas-flow-fast"/>
            
            <!-- C2 to C1 Duct -->
            <path d="M 390 160 L 390 100 L 290 100 L 290 70" fill="none" stroke="#0ea5e9" stroke-width="7" stroke-dasharray="6,4" class="gas-flow-up"/>
            
            <!-- C3 to C2 Duct -->
            <path d="M 230 270 L 230 200 L 330 200 L 330 160" fill="none" stroke="#f59e0b" stroke-width="8" stroke-dasharray="6,4" class="gas-flow-up"/>
            
            <!-- C4 to C3 Duct -->
            <path d="M 410 370 L 410 300 L 270 300 L 270 270" fill="none" stroke="#ea580c" stroke-width="9" stroke-dasharray="6,4" class="gas-flow-up"/>

            <!-- Calciner & C5 to C4 Duct -->
            <path d="M 520 420 L 520 370 L 410 370" fill="none" stroke="#dc2626" stroke-width="10" stroke-dasharray="6,4" class="gas-flow-hot"/>

            <!-- Kiln Riser Duct to Calciner -->
            <path d="M 590 560 L 590 460 L 540 460" fill="none" stroke="#ef4444" stroke-width="14" stroke-dasharray="6,4" class="gas-flow-blazing"/>

            <!-- Raw Meal Descending Chutes (Gravity Flow) -->
            <path d="M 250 115 L 340 180" fill="none" stroke="#fef08a" stroke-width="4" stroke-dasharray="4,4" class="meal-flow-down"/>
            <path d="M 370 215 L 250 290" fill="none" stroke="#fef08a" stroke-width="4" stroke-dasharray="4,4" class="meal-flow-down"/>
            <path d="M 250 325 L 390 390" fill="none" stroke="#fde047" stroke-width="5" stroke-dasharray="4,4" class="meal-flow-down"/>
            <!-- C4 meal chute to Calciner -->
            <path id="chute-c4-meal" d="M 390 435 L 480 470" fill="none" stroke="#fde047" stroke-width="5" stroke-dasharray="4,4" class="meal-flow-down"/>
            <!-- C5 meal chute to Kiln Inlet -->
            <path d="M 580 500 L 610 540" fill="none" stroke="#eab308" stroke-width="6" stroke-dasharray="4,4" class="meal-flow-down"/>

            <!-- ================= STAGE 1: CYCLONE C1 (Top Dual) ================= -->
            <g id="cyclone-c1" class="cyclone-group">
              <!-- Cyclone Body -->
              <rect x="210" y="45" width="80" height="40" rx="4" fill="url(#gradC1)" stroke="#38bdf8" stroke-width="2"/>
              <!-- Conical Bottom -->
              <polygon points="210,85 290,85 255,125 245,125" fill="url(#gradC1)" stroke="#38bdf8" stroke-width="2"/>
              <text x="250" y="70" text-anchor="middle" fill="#38bdf8" font-size="12" font-weight="700" font-family="monospace">C1 (TOP)</text>
            </g>

            <!-- ================= STAGE 2: CYCLONE C2 ================= -->
            <g id="cyclone-c2" class="cyclone-group">
              <rect x="330" y="145" width="85" height="45" rx="4" fill="url(#gradC2)" stroke="#0ea5e9" stroke-width="2"/>
              <polygon points="330,190 415,190 378,235 367,235" fill="url(#gradC2)" stroke="#0ea5e9" stroke-width="2"/>
              <text x="372" y="172" text-anchor="middle" fill="#0ea5e9" font-size="12" font-weight="700" font-family="monospace">C2 STAGE</text>
            </g>

            <!-- ================= STAGE 3: CYCLONE C3 ================= -->
            <g id="cyclone-c3" class="cyclone-group">
              <rect x="210" y="255" width="90" height="50" rx="4" fill="url(#gradC3)" stroke="#f59e0b" stroke-width="2"/>
              <polygon points="210,305 300,305 260,355 250,355" fill="url(#gradC3)" stroke="#f59e0b" stroke-width="2"/>
              <text x="255" y="285" text-anchor="middle" fill="#f59e0b" font-size="12" font-weight="700" font-family="monospace">C3 STAGE</text>
            </g>

            <!-- ================= STAGE 4: CYCLONE C4 ================= -->
            <g id="cyclone-c4" class="cyclone-group">
              <rect id="c4-body-rect" x="350" y="365" width="95" height="55" rx="4" fill="url(#gradC4)" stroke="#f97316" stroke-width="2"/>
              <polygon id="c4-cone-poly" points="350,420 445,420 403,475 392,475" fill="url(#gradC4)" stroke="#f97316" stroke-width="2"/>
              <text x="397" y="398" text-anchor="middle" fill="#f97316" font-size="12" font-weight="700" font-family="monospace">C4 STAGE</text>

              <!-- Air Blaster Cannon on C4 Cone -->
              <g id="c4-blaster-assembly" transform="translate(330, 440)">
                <rect x="0" y="0" width="18" height="12" rx="2" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5"/>
                <polygon points="18,3 28,1 28,11 18,9" fill="#0369a1"/>
                <circle cx="9" cy="6" r="2.5" fill="#f8fafc"/>
                <text x="-5" y="10" text-anchor="end" fill="#38bdf8" font-size="9" font-family="monospace">AB-41</text>
                <!-- Blast Wave Effect (Hidden normally) -->
                <circle id="c4-blast-circle" cx="28" cy="6" r="28" fill="url(#blastWave)" opacity="0" class="blast-anim"/>
              </g>

              <!-- Material Blockage Indicator (Flashing when blocked) -->
              <g id="c4-blockage-marker" opacity="0" transform="translate(385, 435)">
                <polygon points="0,0 24,0 12,20" fill="#ef4444" stroke="#fca5a5" stroke-width="1.5"/>
                <text x="12" y="14" text-anchor="middle" fill="#fff" font-size="10" font-weight="900">!</text>
              </g>
            </g>

            <!-- ================= STAGE 5: CYCLONE C5 (Bottom Stage) ================= -->
            <g id="cyclone-c5" class="cyclone-group">
              <rect x="520" y="405" width="95" height="55" rx="4" fill="url(#gradC5)" stroke="#ef4444" stroke-width="2"/>
              <polygon points="520,460 615,460 573,515 562,515" fill="url(#gradC5)" stroke="#ef4444" stroke-width="2"/>
              <text x="567" y="438" text-anchor="middle" fill="#ef4444" font-size="12" font-weight="700" font-family="monospace">C5 BOTTOM</text>

              <!-- Air Blaster Cannon on C5 Cone -->
              <g id="c5-blaster-assembly" transform="translate(620, 480)">
                <rect x="0" y="0" width="18" height="12" rx="2" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5"/>
                <polygon points="0,3 -10,1 -10,11 0,9" fill="#0369a1"/>
                <circle cx="9" cy="6" r="2.5" fill="#f8fafc"/>
                <text x="22" y="10" text-anchor="start" fill="#38bdf8" font-size="9" font-family="monospace">AB-51</text>
                <circle id="c5-blast-circle" cx="-10" cy="6" r="28" fill="url(#blastWave)" opacity="0" class="blast-anim"/>
              </g>
            </g>

            <!-- ================= PRECALCINER VESSEL ================= -->
            <g id="precalciner-vessel">
              <rect x="470" y="440" width="46" height="110" rx="10" fill="url(#gradCalciner)" stroke="#f87171" stroke-width="2.5" filter="url(#flame-glow)"/>
              
              <!-- Live Animated Flame Inside Calciner -->
              <g id="calciner-flame" transform="translate(482, 490)">
                <path d="M 11 35 Q 2 18 11 0 Q 20 18 11 35 Z" fill="#fef08a" opacity="0.95" class="flame-core"/>
                <path d="M 11 40 Q -2 20 11 -8 Q 24 20 11 40 Z" fill="#f97316" opacity="0.65" class="flame-outer"/>
              </g>

              <text x="493" y="465" text-anchor="middle" fill="#fff" font-size="10" font-weight="800" font-family="monospace">CALCINER</text>
              <text x="493" y="540" text-anchor="middle" fill="#fef08a" font-size="9" font-family="monospace" id="calciner-rate-txt">93.8%</text>
            </g>

            <!-- Tertiary Air Duct from Cooler -->
            <path d="M 680 570 L 680 480 L 516 480" fill="none" stroke="#fbbf24" stroke-width="10" stroke-dasharray="6,4" class="gas-flow-hot"/>
            <text x="640" y="472" fill="#fbbf24" font-size="10" font-weight="700" font-family="monospace">TERTIARY AIR (825°C)</text>

            <!-- Rotary Kiln Inlet Section -->
            <g id="kiln-inlet-graphic" transform="translate(580, 545)">
              <rect x="0" y="0" width="150" height="42" rx="4" fill="#1e293b" stroke="#ef4444" stroke-width="2"/>
              <rect x="25" y="6" width="100" height="30" rx="3" fill="#991b1b" opacity="0.8"/>
              <text x="75" y="24" text-anchor="middle" fill="#fee2e2" font-size="11" font-weight="800" font-family="monospace">ROTARY KILN INLET</text>
              <text x="75" y="35" text-anchor="middle" fill="#fca5a5" font-size="9" font-family="monospace" id="kiln-inlet-temp-svg">1085°C &bull; -12.5 mbar</text>
            </g>

            <!-- Preheater ID Fan (6.6 kV - 3150 kW) -->
            <g id="id-fan-assembly" transform="translate(35, 100)">
              <!-- Fan Scroll Housing -->
              <circle cx="45" cy="45" r="35" fill="#0f172a" stroke="#0284c7" stroke-width="3"/>
              <!-- Rotating Impeller Blades -->
              <g id="id-fan-impeller" class="rotating-fan">
                <line x1="45" y1="20" x2="45" y2="70" stroke="#38bdf8" stroke-width="4"/>
                <line x1="20" y1="45" x2="70" y2="45" stroke="#38bdf8" stroke-width="4"/>
                <line x1="27" y1="27" x2="63" y2="63" stroke="#38bdf8" stroke-width="4"/>
                <line x1="27" y1="63" x2="63" y2="27" stroke="#38bdf8" stroke-width="4"/>
                <circle cx="45" cy="45" r="8" fill="#e0f2fe"/>
              </g>
              <!-- Motor Box -->
              <rect x="85" y="25" width="40" height="40" rx="4" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
              <text x="105" y="42" text-anchor="middle" fill="#38bdf8" font-size="8" font-weight="800" font-family="monospace">6.6 kV</text>
              <text x="105" y="55" text-anchor="middle" fill="#e0f2fe" font-size="8" font-family="monospace">3150kW</text>

              <text x="45" y="95" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="700" font-family="monospace">PREHEATER ID FAN</text>
              <text x="45" y="110" text-anchor="middle" fill="#94a3b8" font-size="9" font-family="monospace" id="id-fan-subtext">985 RPM &bull; -58.2 mbar</text>
            </g>

            <!-- Live Telemetry Callout Overlay Badges -->
            <!-- C1 Callout -->
            <g id="callout-c1" transform="translate(295, 45)">
              <rect x="0" y="0" width="105" height="34" rx="4" fill="#0b1120" stroke="#38bdf8" stroke-width="1.2" opacity="0.95"/>
              <text x="6" y="14" fill="#38bdf8" font-size="9" font-weight="700" font-family="monospace">C1 TEMP / DRAFT</text>
              <text x="6" y="28" fill="#f8fafc" font-size="11" font-weight="800" font-family="monospace" id="tag-c1-val">312°C | -56.4mb</text>
            </g>

            <!-- C2 Callout -->
            <g id="callout-c2" transform="translate(425, 150)">
              <rect x="0" y="0" width="105" height="34" rx="4" fill="#0b1120" stroke="#0ea5e9" stroke-width="1.2" opacity="0.95"/>
              <text x="6" y="14" fill="#0ea5e9" font-size="9" font-weight="700" font-family="monospace">C2 TEMP / DRAFT</text>
              <text x="6" y="28" fill="#f8fafc" font-size="11" font-weight="800" font-family="monospace" id="tag-c2-val">494°C | -42.8mb</text>
            </g>

            <!-- C3 Callout -->
            <g id="callout-c3" transform="translate(95, 260)">
              <rect x="0" y="0" width="105" height="34" rx="4" fill="#0b1120" stroke="#f59e0b" stroke-width="1.2" opacity="0.95"/>
              <text x="6" y="14" fill="#f59e0b" font-size="9" font-weight="700" font-family="monospace">C3 TEMP / DRAFT</text>
              <text x="6" y="28" fill="#f8fafc" font-size="11" font-weight="800" font-family="monospace" id="tag-c3-val">662°C | -32.1mb</text>
            </g>

            <!-- C4 Callout -->
            <g id="callout-c4" transform="translate(235, 370)">
              <rect id="callout-c4-rect" x="0" y="0" width="108" height="34" rx="4" fill="#0b1120" stroke="#f97316" stroke-width="1.2" opacity="0.95"/>
              <text x="6" y="14" fill="#f97316" font-size="9" font-weight="700" font-family="monospace">C4 CONE TEMP</text>
              <text x="6" y="28" fill="#f8fafc" font-size="11" font-weight="800" font-family="monospace" id="tag-c4-val">795°C | -22.4mb</text>
            </g>

            <!-- Calciner Callout -->
            <g id="callout-calciner" transform="translate(525, 355)">
              <rect x="0" y="0" width="120" height="34" rx="4" fill="#0b1120" stroke="#ef4444" stroke-width="1.2" opacity="0.95"/>
              <text x="6" y="14" fill="#f87171" font-size="9" font-weight="700" font-family="monospace">CALCINER / FLAME</text>
              <text x="6" y="28" fill="#f8fafc" font-size="11" font-weight="800" font-family="monospace" id="tag-calc-val">905°C | 14.2 t/h</text>
            </g>

            <!-- C5 Callout -->
            <g id="callout-c5" transform="translate(625, 415)">
              <rect x="0" y="0" width="105" height="34" rx="4" fill="#0b1120" stroke="#ef4444" stroke-width="1.2" opacity="0.95"/>
              <text x="6" y="14" fill="#ef4444" font-size="9" font-weight="700" font-family="monospace">C5 BOTTOM</text>
              <text x="6" y="28" fill="#f8fafc" font-size="11" font-weight="800" font-family="monospace" id="tag-c5-val">882°C | -16.8mb</text>
            </g>
          </svg>
        </div>

        <!-- Preheater Interactive Operator Controls Strip -->
        <div class="preheater-control-strip">
          <div class="control-box">
            <span class="control-label">ID FAN INLET DAMPER</span>
            <div class="control-slider-wrap">
              <input type="range" min="20" max="100" value="78" id="slider-id-damper" class="range-slider">
              <span class="control-val font-mono text-cyan" id="txt-id-damper">78%</span>
            </div>
          </div>

          <div class="control-box">
            <span class="control-label">AIR BLASTER MANIFOLD (8.5 BAR)</span>
            <div class="blaster-actions">
              <button class="btn btn-secondary btn-sm" id="btn-fire-blaster">
                <i class="fa-solid fa-burst text-amber"></i>
                <span>Pulse Air Cannons (C4/C5)</span>
              </button>
              <span class="font-mono text-muted text-xs" id="lbl-blaster-time">READY</span>
            </div>
          </div>

          <div class="control-box">
            <span class="control-label">TERTIARY AIR SHUTTER</span>
            <span class="control-val font-mono text-amber">OPEN (100%) &bull; 825°C</span>
          </div>

          <div class="control-box">
            <span class="control-label">RAW MEAL WEIGH FEEDER</span>
            <span class="control-val font-mono text-green">240.0 t/h &bull; RUNNING</span>
          </div>
        </div>
      </div>
    `;

    // Hook Damper Slider
    const slider = document.getElementById('slider-id-damper') as HTMLInputElement;
    if (slider) {
      slider.addEventListener('input', (e) => {
        const val = +(e.target as HTMLInputElement).value;
        this.state.setIdFanDamper(val);
        const txt = document.getElementById('txt-id-damper');
        if (txt) txt.textContent = `${val}%`;
      });
    }

    // Hook Air Blaster Manual Fire Button
    const btnBlaster = document.getElementById('btn-fire-blaster');
    if (btnBlaster) {
      btnBlaster.addEventListener('click', () => {
        this.state.fireAirBlaster(false);
      });
    }
  }

  private updateTelemetry() {
    const ph = this.state.preheater;

    // Badges
    const badgeFeed = document.getElementById('ph-meal-feed');
    if (badgeFeed) badgeFeed.textContent = `RAW MEAL: ${ph.rawMealFeedTph} t/h`;

    const badgeFan = document.getElementById('ph-fan-kw');
    if (badgeFan) badgeFan.textContent = `ID FAN: ${ph.idFan.motorPowerKw} kW`;

    // C1 to C5 tags
    const c1 = ph.cyclones[0];
    const tagC1 = document.getElementById('tag-c1-val');
    if (tagC1) tagC1.textContent = `${c1.temperature}°C | ${c1.draftPressure}mb`;

    const c2 = ph.cyclones[1];
    const tagC2 = document.getElementById('tag-c2-val');
    if (tagC2) tagC2.textContent = `${c2.temperature}°C | ${c2.draftPressure}mb`;

    const c3 = ph.cyclones[2];
    const tagC3 = document.getElementById('tag-c3-val');
    if (tagC3) tagC3.textContent = `${c3.temperature}°C | ${c3.draftPressure}mb`;

    const c4 = ph.cyclones[3];
    const tagC4 = document.getElementById('tag-c4-val');
    if (tagC4) tagC4.textContent = `${c4.temperature}°C | ${c4.draftPressure}mb`;

    const c5 = ph.cyclones[4];
    const tagC5 = document.getElementById('tag-c5-val');
    if (tagC5) tagC5.textContent = `${c5.temperature}°C | ${c5.draftPressure}mb`;

    // Calciner
    const tagCalc = document.getElementById('tag-calc-val');
    if (tagCalc) tagCalc.textContent = `${ph.calciner.temperature}°C | ${ph.calciner.fuelFlow} t/h`;

    const rateTxt = document.getElementById('calciner-rate-txt');
    if (rateTxt) rateTxt.textContent = `${ph.calciner.calcinationRate}%`;

    // Flame opacity & color
    const flameEl = document.getElementById('calciner-flame');
    if (flameEl) {
      flameEl.style.display = ph.calciner.flameDetected ? 'block' : 'none';
    }

    // Kiln inlet tag
    const tagInlet = document.getElementById('kiln-inlet-temp-svg');
    if (tagInlet) tagInlet.textContent = `${ph.kilnInlet.temperature}°C • ${ph.kilnInlet.draftPressure} mbar`;

    // ID fan subtext
    const idTxt = document.getElementById('id-fan-subtext');
    if (idTxt) idTxt.textContent = `${ph.idFan.speedRpm} RPM • ${ph.idFan.draftInletMbar} mbar`;

    // C4 blockage visual marker
    const blockageMarker = document.getElementById('c4-blockage-marker');
    const c4CalloutRect = document.getElementById('callout-c4-rect');
    if (blockageMarker) {
      blockageMarker.setAttribute('opacity', this.state.faults.c4Plugging ? '1' : '0');
    }
    if (c4CalloutRect) {
      c4CalloutRect.setAttribute('stroke', this.state.faults.c4Plugging ? '#ef4444' : '#f97316');
      c4CalloutRect.setAttribute('stroke-width', this.state.faults.c4Plugging ? '3' : '1.2');
    }

    // Air Blaster firing animations
    const c4Blast = document.getElementById('c4-blast-circle');
    const c5Blast = document.getElementById('c5-blast-circle');
    const blasterTime = document.getElementById('lbl-blaster-time');
    if (c4Blast && c5Blast) {
      const active = c4.airBlasterActive || c5.airBlasterActive;
      c4Blast.setAttribute('opacity', active ? '1' : '0');
      c5Blast.setAttribute('opacity', active ? '1' : '0');
      if (blasterTime) {
        blasterTime.textContent = active ? 'FIRING CANNONS (8.5 BAR)!' : ph.airBlasterLastFired;
        blasterTime.className = active ? 'font-mono text-cyan font-bold text-xs' : 'font-mono text-muted text-xs';
      }
    }
  }
}

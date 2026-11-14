/**
 * PYRO-CLINKER: 5-Stage Preheater Tower, Calciner DCS & Clinker Cooler Automation Suite
 * Master Application Entrypoint
 * 
 * Lead Electrical & Automation Systems Engineer: أ. طارق ابوعشي | Tareq Abuashi
 */

import { scadaState } from './engine/scadaState';
import { scadaAudio } from './engine/audioAlarm';
import { PreheaterGraphic } from './components/PreheaterGraphic';
import { CoolerGraphic } from './components/CoolerGraphic';
import { BmsCemsPanel } from './components/BmsCemsPanel';
import { RefractoryScanner } from './components/RefractoryScanner';
import { DossierModal } from './components/DossierModal';

document.addEventListener('DOMContentLoaded', () => {
  console.log('Initializing PYRO-CLINKER Industrial DCS Suite...');

  // Initialize UI Components
  new PreheaterGraphic('preheater-container', scadaState);
  new CoolerGraphic('cooler-container', scadaState);
  new BmsCemsPanel('bms-cems-container', scadaState);
  new RefractoryScanner('scanner-container', scadaState);
  const dossierModal = new DossierModal('dossier-modal-container');

  // Header Elements
  const btnAudio = document.getElementById('btn-audio-toggle');
  const audioIcon = document.getElementById('audio-icon');
  const audioText = document.getElementById('audio-text');
  const btnScreenShare = document.getElementById('btn-screen-share');
  const btnOpenDossier = document.getElementById('btn-open-dossier');
  const btnQuickReset = document.getElementById('btn-quick-reset');

  // Annunciator Banner Elements
  const alarmBadge = document.getElementById('alarm-badge-status');
  const alarmMsg = document.getElementById('alarm-banner-message');
  const soeTimestamp = document.getElementById('soe-timestamp');
  const headerClock = document.getElementById('header-clock');
  const headerGridFreq = document.getElementById('header-grid-freq');
  const headerBusVolts = document.getElementById('header-bus-volts');

  // Fault Action Buttons
  const btnFaultC4 = document.getElementById('btn-fault-c4');
  const btnFaultCo = document.getElementById('btn-fault-co');
  const btnFaultCooler = document.getElementById('btn-fault-cooler');
  const btnFaultReset = document.getElementById('btn-fault-reset');

  // SOE Log Elements
  const soeTableBody = document.getElementById('soe-table-body');
  const btnClearSoe = document.getElementById('btn-clear-soe');
  const btnExportSoe = document.getElementById('btn-export-soe');

  // Audio Toggle
  if (btnAudio && audioIcon && audioText) {
    btnAudio.addEventListener('click', () => {
      const isMuted = scadaAudio.toggleMute();
      if (isMuted) {
        audioIcon.className = 'fa-solid fa-volume-xmark text-muted';
        audioText.textContent = 'Audio: Muted';
      } else {
        audioIcon.className = 'fa-solid fa-volume-high text-cyan';
        audioText.textContent = 'Audio: Active';
        scadaAudio.playClick();
      }
    });
  }

  // Screen Share or Fullscreen Toggle
  if (btnScreenShare) {
    btnScreenShare.addEventListener('click', async () => {
      scadaAudio.playClick();
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
          await navigator.mediaDevices.getDisplayMedia({ video: true });
        } else if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
      } catch (err) {
        // Fallback to Fullscreen
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      }
    });
  }

  // Open Dossier
  if (btnOpenDossier) {
    btnOpenDossier.addEventListener('click', () => {
      scadaAudio.playClick();
      dossierModal.open();
    });
  }

  // Quick Reset
  if (btnQuickReset) {
    btnQuickReset.addEventListener('click', () => {
      scadaState.triggerEmergencyResetAndPurge();
    });
  }

  // Fault Injections
  if (btnFaultC4) {
    btnFaultC4.addEventListener('click', () => {
      scadaState.triggerC4Plugging();
    });
  }

  if (btnFaultCo) {
    btnFaultCo.addEventListener('click', () => {
      scadaState.triggerHighCoSpike();
    });
  }

  if (btnFaultCooler) {
    btnFaultCooler.addEventListener('click', () => {
      scadaState.triggerCoolerStall();
    });
  }

  if (btnFaultReset) {
    btnFaultReset.addEventListener('click', () => {
      scadaState.triggerEmergencyResetAndPurge();
    });
  }

  // Clear SOE
  if (btnClearSoe) {
    btnClearSoe.addEventListener('click', () => {
      scadaAudio.playClick();
      scadaState.soeLog = [];
      updateSoeTable();
    });
  }

  // Export SOE as CSV
  if (btnExportSoe) {
    btnExportSoe.addEventListener('click', () => {
      scadaAudio.playClick();
      exportSoeCsv();
    });
  }

  function exportSoeCsv() {
    const headers = ['Timestamp', 'Source', 'EventCode', 'Description', 'Severity'];
    const rows = scadaState.soeLog.map(e => [
      `"${e.timestamp}"`,
      `"${e.source}"`,
      `"${e.code}"`,
      `"${e.description.replace(/"/g, '""')}"`,
      `"${e.severity}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PYRO_CLINKER_SOE_LOG_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function updateSoeTable() {
    if (!soeTableBody) return;
    const events = scadaState.soeLog;
    soeTableBody.innerHTML = events.slice(0, 30).map(e => `
      <tr>
        <td class="text-cyan">${e.timestamp}</td>
        <td class="text-muted">${e.source}</td>
        <td class="text-amber font-bold">${e.code}</td>
        <td>${e.description}</td>
        <td>
          <span class="severity-tag ${e.severity.toLowerCase()}">${e.severity}</span>
        </td>
      </tr>
    `).join('');
  }

  // Subscribe to Central State Changes
  scadaState.subscribe(() => {
    // Clock
    if (headerClock) {
      headerClock.textContent = scadaState.soeClockString.split('.')[0];
    }
    if (soeTimestamp) {
      soeTimestamp.textContent = scadaState.soeClockString;
    }

    // Grid Jitter
    if (headerGridFreq) {
      const freq = (50.0 + (Math.random() * 0.04 - 0.02)).toFixed(2);
      headerGridFreq.textContent = `${freq} Hz`;
    }
    if (headerBusVolts) {
      const volts = Math.round(6600 + (Math.random() * 12 - 6));
      headerBusVolts.textContent = `${volts.toLocaleString()} V`;
    }

    // Annunciator Banner
    if (alarmBadge && alarmMsg) {
      alarmBadge.textContent = scadaState.masterStatus;
      alarmMsg.textContent = scadaState.masterMessage;

      if (scadaState.masterStatus === 'TRIP') {
        alarmBadge.className = 'alarm-badge tripped';
      } else if (scadaState.masterStatus === 'WARNING') {
        alarmBadge.className = 'alarm-badge warning';
      } else {
        alarmBadge.className = 'alarm-badge healthy';
      }
    }

    // Refresh SOE Table
    updateSoeTable();
  });

  // Initial table population
  updateSoeTable();
});

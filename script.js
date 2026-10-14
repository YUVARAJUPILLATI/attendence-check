/**
 * AttendWise – Student Attendance Calculator
 * Core Logic & Interactive Controller
 *
 * Implements the mathematical formulas:
 * - Attendance % = (attended / (attended + absent)) * 100
 * - If % >= 75%: extraAbsences = Math.max(0, Math.floor(attended / 3) - absent)
 * - If % < 75%:  required      = Math.max(0, 3 * absent - attended)
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements - Form & Inputs
  const form = document.getElementById('attendance-form');
  const attendedInput = document.getElementById('attended-input');
  const absentInput = document.getElementById('absent-input');
  const attendedError = document.getElementById('attended-error');
  const absentError = document.getElementById('absent-error');
  const generalError = document.getElementById('general-error');
  const generalErrorText = document.getElementById('general-error-text');
  const resetBtn = document.getElementById('reset-btn');
  const exampleChips = document.querySelectorAll('.chip-btn');

  // DOM Elements - Results Dashboard
  const emptyState = document.getElementById('empty-state');
  const resultsDisplay = document.getElementById('results-display');
  const meterProgress = document.getElementById('meter-progress');
  const meterPercentValue = document.getElementById('meter-percent-value');
  const statusBanner = document.getElementById('status-banner');
  const statusIcon = document.getElementById('status-icon');
  const statusTitle = document.getElementById('status-title');
  const statusSubtitle = document.getElementById('status-subtitle');
  const linearFill = document.getElementById('linear-fill');

  // Stat Elements
  const statTotal = document.getElementById('stat-total');
  const statAttended = document.getElementById('stat-attended');
  const statAttendedRatio = document.getElementById('stat-attended-ratio');
  const statAbsent = document.getElementById('stat-absent');
  const statAbsentRatio = document.getElementById('stat-absent-ratio');
  const actionMetricCard = document.getElementById('action-metric-card');
  const actionMetricLabel = document.getElementById('action-metric-label');
  const actionMetricIcon = document.getElementById('action-metric-icon');
  const statActionValue = document.getElementById('stat-action-value');
  const actionMetricFooter = document.getElementById('action-metric-footer');
  const adviceHeading = document.getElementById('advice-heading');
  const adviceMessage = document.getElementById('advice-message');

  // Meter Circle Geometry (Radius = 68)
  const CIRCUMFERENCE = 2 * Math.PI * 68; // ~427.26

  /**
   * Validate user input values
   * Accepts non-negative integers only.
   * Total conducted classes must be > 0.
   */
  function validateInputs() {
    clearErrors();

    const attendedVal = attendedInput.value.trim();
    const absentVal = absentInput.value.trim();
    let isValid = true;

    // Check empty fields
    if (attendedVal === '') {
      showFieldError(attendedInput, attendedError, 'Please enter classes attended.');
      isValid = false;
    }

    if (absentVal === '') {
      showFieldError(absentInput, absentError, 'Please enter classes absent.');
      isValid = false;
    }

    if (!isValid) {
      showGeneralError('Please fill in both attendance fields.');
      return null;
    }

    // Number conversion & Whole Number check
    const attendedNum = Number(attendedVal);
    const absentNum = Number(absentVal);

    if (!Number.isInteger(attendedNum) || attendedNum < 0) {
      showFieldError(attendedInput, attendedError, 'Enter a valid whole number (0 or higher).');
      isValid = false;
    }

    if (!Number.isInteger(absentNum) || absentNum < 0) {
      showFieldError(absentInput, absentError, 'Enter a valid whole number (0 or higher).');
      isValid = false;
    }

    if (!isValid) {
      showGeneralError('Negative numbers and decimals are not allowed.');
      return null;
    }

    // Prevent Division by Zero when total is 0
    const total = attendedNum + absentNum;
    if (total === 0) {
      showFieldError(attendedInput, attendedError, 'Total classes cannot be zero.');
      showFieldError(absentInput, absentError, 'At least one class must be held.');
      showGeneralError('Total classes (Attended + Absent) cannot be zero.');
      return null;
    }

    return { attended: attendedNum, absent: absentNum, total };
  }

  function showFieldError(inputEl, errorEl, message) {
    inputEl.classList.add('input-error');
    errorEl.textContent = message;
  }

  function showGeneralError(message) {
    generalErrorText.textContent = message;
    generalError.classList.remove('hidden');
  }

  function clearErrors() {
    attendedInput.classList.remove('input-error');
    absentInput.classList.remove('input-error');
    attendedError.textContent = '';
    absentError.textContent = '';
    generalError.classList.add('hidden');
    generalErrorText.textContent = '';
  }

  /**
   * Calculates attendance & renders dashboard
   */
  function calculateAttendance() {
    const data = validateInputs();
    if (!data) return;

    const { attended, absent, total } = data;

    // Attendance percentage calculation
    const percentage = (attended / total) * 100;
    const isSafe = percentage >= 75;

    // Hide empty state & show results card
    emptyState.classList.add('hidden');
    resultsDisplay.classList.remove('hidden');

    // Update Circular Progress & Linear Progress
    updateProgressVisuals(percentage, isSafe);

    // Update Stats Overview
    animateValue(statTotal, total);
    animateValue(statAttended, attended);
    animateValue(statAbsent, absent);

    statAttendedRatio.textContent = `${attended} of ${total} attended`;
    statAbsentRatio.textContent = `${absent} of ${total} absent`;

    // Handle 75% Requirement Branching
    if (isSafe) {
      // Formula: Math.max(0, Math.floor(attended / 3) - absent)
      const extraAbsences = Math.max(0, Math.floor(attended / 3) - absent);

      renderSafeState(percentage, extraAbsences, attended, absent, total);
    } else {
      // Formula: Math.max(0, 3 * absent - attended)
      const requiredClasses = Math.max(0, (3 * absent) - attended);

      renderDangerState(percentage, requiredClasses, attended, absent, total);
    }
  }

  /**
   * Render state when attendance is >= 75%
   */
  function renderSafeState(percentage, extraAbsences, attended, absent, total) {
    // Status Banner
    statusBanner.className = 'status-banner status-safe';
    statusIcon.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M20 6L9 17l-5-5"></path>
      </svg>
    `;
    statusTitle.textContent = 'Safe Attendance Zone';
    statusSubtitle.textContent = `You are maintaining ${percentage.toFixed(2)}%, well above the 75% minimum criterion.`;

    // Action Metric Card
    actionMetricCard.className = 'metric-card highlight-card card-safe';
    actionMetricLabel.textContent = 'Safe Bunks / Absences Allowed';
    actionMetricIcon.textContent = '🛡️';
    animateValue(statActionValue, extraAbsences);
    actionMetricFooter.textContent = extraAbsences === 1 ? '1 more class can be missed' : `${extraAbsences} more classes can be missed`;

    // Action Advice Box
    adviceHeading.textContent = 'Excellent Work! Keep It Up';
    if (extraAbsences > 0) {
      adviceMessage.innerHTML = `You can afford to be absent for up to <strong>${extraAbsences}</strong> additional ${extraAbsences === 1 ? 'class' : 'classes'} without falling below the 75% threshold. Use your absences wisely!`;
    } else {
      adviceMessage.innerHTML = `You currently have <strong>0</strong> safe absences remaining. Missing even one more class will drop your attendance below 75%. Make sure you attend the upcoming classes.`;
    }
  }

  /**
   * Render state when attendance is < 75%
   */
  function renderDangerState(percentage, requiredClasses, attended, absent, total) {
    // Status Banner
    statusBanner.className = 'status-banner status-danger';
    statusIcon.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
    `;
    statusTitle.textContent = 'Attendance Shortage Alert!';
    statusSubtitle.textContent = `Your attendance is currently at ${percentage.toFixed(2)}%, which is below the mandatory 75% limit.`;

    // Action Metric Card
    actionMetricCard.className = 'metric-card highlight-card card-danger';
    actionMetricLabel.textContent = 'Consecutive Classes Required';
    actionMetricIcon.textContent = '🚨';
    animateValue(statActionValue, requiredClasses);
    actionMetricFooter.textContent = `Need ${requiredClasses} consecutive attendances`;

    // Action Advice Box
    adviceHeading.textContent = 'Immediate Recovery Plan';
    adviceMessage.innerHTML = `You must attend the next <strong>${requiredClasses}</strong> ${requiredClasses === 1 ? 'class' : 'classes'} in a row without missing any to pull your cumulative attendance back up to 75.00%.`;
  }

  /**
   * Update circular progress bar and linear gauge
   */
  function updateProgressVisuals(percentage, isSafe) {
    // Clamp visual display between 0 and 100 for gauge geometry
    const clamped = Math.max(0, Math.min(100, percentage));
    const offset = CIRCUMFERENCE - (clamped / 100) * CIRCUMFERENCE;

    // Colors
    const primaryColor = isSafe ? '#10b981' : '#f43f5e';

    meterProgress.style.stroke = primaryColor;
    meterProgress.style.strokeDashoffset = offset;

    // Linear bar
    linearFill.style.width = `${clamped}%`;
    linearFill.className = `linear-fill ${isSafe ? 'fill-safe' : 'fill-danger'}`;

    // Animate percentage text
    animatePercentage(meterPercentValue, percentage);
  }

  /**
   * Smooth number counter animation
   */
  function animateValue(element, target) {
    const duration = 600;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (target - start) * ease);
      element.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target;
      }
    }

    requestAnimationFrame(update);
  }

  /**
   * Smooth percentage text animation
   */
  function animatePercentage(element, target) {
    const duration = 750;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = (start + (target - start) * ease);
      element.textContent = `${current.toFixed(2)}%`;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = `${target.toFixed(2)}%`;
      }
    }

    requestAnimationFrame(update);
  }

  /**
   * Reset form and clear results
   */
  function resetAll() {
    form.reset();
    clearErrors();

    // Reset gauge visual
    meterProgress.style.strokeDashoffset = CIRCUMFERENCE;
    linearFill.style.width = '0%';
    meterPercentValue.textContent = '0.00%';

    // Hide results and show empty placeholder
    resultsDisplay.classList.add('hidden');
    emptyState.classList.remove('hidden');

    attendedInput.focus();
  }

  // Event Listeners
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    calculateAttendance();
  });

  resetBtn.addEventListener('click', resetAll);

  // Clear errors on input typing
  attendedInput.addEventListener('input', () => {
    if (attendedInput.classList.contains('input-error')) {
      clearErrors();
    }
  });

  absentInput.addEventListener('input', () => {
    if (absentInput.classList.contains('input-error')) {
      clearErrors();
    }
  });

  // Example chip triggers
  exampleChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const attended = chip.getAttribute('data-attended');
      const absent = chip.getAttribute('data-absent');
      attendedInput.value = attended;
      absentInput.value = absent;
      calculateAttendance();
    });
  });

  // Keyboard shortcut: Escape to reset
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      resetAll();
    }
  });
});

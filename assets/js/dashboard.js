// =================== CALENDAR ===================
function renderCalendar() {
  const days = document.getElementById('calDays');
  if (!days) return;
  const today = new Date();
  const year = today.getFullYear(), month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const bookings = [5, 14, 19, 28];
  days.innerHTML = '';
  for (let i = 0; i < firstDay; i++) {
    const d = document.createElement('div');
    d.className = 'cal-day other-month';
    d.textContent = new Date(year, month, -firstDay + i + 1).getDate();
    days.appendChild(d);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const el = document.createElement('div');
    el.className = 'cal-day' + (d === today.getDate() ? ' today' : '') + (bookings.includes(d) ? ' has-booking' : '');
    el.textContent = d;
    el.onclick = () => { document.querySelectorAll('.cal-day').forEach(x => x.classList.remove('selected')); el.classList.add('selected'); };
    days.appendChild(el);
  }
}
renderCalendar();

// =================== TIME SLOTS ===================
document.addEventListener('click', e => {
  if (e.target.classList.contains('time-slot') && !e.target.classList.contains('unavailable')) {
    document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
    e.target.classList.add('selected');
  }
});

// =================== SIGNATURE PAD ===================
(function() {
  const canvas = document.getElementById('sigCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let drawing = false;
  function resize() {
    const pad = canvas.parentElement;
    canvas.width = pad.offsetWidth;
    canvas.height = pad.offsetHeight;
  }
  resize();
  canvas.addEventListener('mousedown', e => { drawing = true; ctx.beginPath(); ctx.moveTo(e.offsetX, e.offsetY); });
  canvas.addEventListener('mousemove', e => { if (!drawing) return; ctx.lineTo(e.offsetX, e.offsetY); ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary'); ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.stroke(); });
  canvas.addEventListener('mouseup', () => drawing = false);
  document.querySelector('.btn-secondary[onclick]') && null; // handled inline
})();
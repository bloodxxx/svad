// ===== EmailJS INIT =====
// ВАЖНО: замените значения ниже на свои ключи с emailjs.com (см. инструкцию)
emailjs.init('C-Y1a4lt-H--muXlG');

const EMAILJS_SERVICE_ID = 'service_520kkjn';
const EMAILJS_TEMPLATE_ID = 'template_b2qivxp';

// ===== COUNTDOWN =====
function updateCountdown() {
  const wedding = new Date('2026-07-31T12:00:00');
  const now = new Date();
  const diff = wedding - now;

  if (diff <= 0) {
    document.getElementById('cd-weeks').textContent = '0';
    document.getElementById('cd-days').textContent = '0';
    document.getElementById('cd-hours').textContent = '0';
    document.getElementById('cd-minutes').textContent = '0';
    document.getElementById('cd-seconds').textContent = '0';
    return;
  }

  const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(totalDays / 7);
  const days = totalDays % 7;
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('cd-weeks').textContent = String(weeks).padStart(2, '0');
  document.getElementById('cd-days').textContent = String(days).padStart(2, '0');
  document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cd-minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('cd-seconds').textContent = String(seconds).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ===== CALENDAR =====
document.getElementById('cal-btn').addEventListener('click', function () {
  const title = encodeURIComponent('Свадьба Ильи и Ксении');
  const start = '20260731T154500';
  const end = '20260731T230000';
  const location = encodeURIComponent('ул. Сибгата Хакима, д. 4, Казань');
  const details = encodeURIComponent('Центр семьи «Казан», серебряный зал. Банкет: снт «Медик» 596');

  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
  const isAndroid = /Android/.test(ua);

  if (isIOS) {
    // Apple Calendar через webcal/data URI
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0',
      'BEGIN:VEVENT',
      'DTSTART:' + start,
      'DTEND:' + end,
      'SUMMARY:Свадьба Ильи и Ксении',
      'LOCATION:ул. Сибгата Хакима, д. 4, Казань',
      'DESCRIPTION:Центр семьи «Казан», серебряный зал. Банкет: снт «Медик» 596',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    window.location.href = url;
  } else if (isAndroid) {
    // Google Calendar (открывается в браузере, затем предлагает приложение)
    window.open(
      'https://www.google.com/calendar/render?action=TEMPLATE' +
      '&text=' + title +
      '&dates=' + start + '%2F' + end +
      '&location=' + location +
      '&details=' + details,
      '_blank'
    );
  } else {
    // Desktop — Google Calendar
    window.open(
      'https://www.google.com/calendar/render?action=TEMPLATE' +
      '&text=' + title +
      '&dates=' + start + '%2F' + end +
      '&location=' + location +
      '&details=' + details,
      '_blank'
    );
  }
});

// ===== RSVP TOGGLE =====
document.getElementById('rsvp-toggle').addEventListener('click', function () {
  const wrap = document.getElementById('rsvp-form-wrap');
  wrap.hidden = false;
  this.style.display = 'none';
  wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// ===== YANDEX MAP =====
ymaps.ready(function () {
  const map = new ymaps.Map('ymap', {
    center: [55.812786, 49.108194],
    zoom: 15,
    controls: ['zoomControl', 'fullscreenControl']
  });

  const placemark = new ymaps.Placemark(
    [55.812786, 49.108194],
    {
      balloonContentHeader: 'Точка сбора гостей',
      balloonContentBody: 'ул. Сибгата Хакима, д. 4, Казань<br>Центр семьи «Казан»',
    },
    {
      preset: 'islands#redHeartIcon'
    }
  );

  map.geoObjects.add(placemark);
  placemark.balloon.open();
});

// ===== RSVP FORM =====
const form = document.getElementById('rsvp-form');
const submitBtn = document.getElementById('rsvp-submit');
const successMsg = document.getElementById('form-success');
const errorMsg = document.getElementById('form-error-global');

function getCheckedValues(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
    .map(el => el.value)
    .join(', ') || 'не указано';
}

function getRadioValue(name) {
  const checked = document.querySelector(`input[name="${name}"]:checked`);
  return checked ? checked.value : null;
}

function showError(id) {
  document.getElementById(id).style.display = 'block';
}

function hideError(id) {
  document.getElementById(id).style.display = 'none';
}

function validateForm() {
  let valid = true;

  const name = document.getElementById('guest-name');
  const phone = document.getElementById('guest-phone');
  const attendance = getRadioValue('attendance');

  hideError('err-name');
  hideError('err-phone');
  hideError('err-attendance');
  name.classList.remove('invalid');
  phone.classList.remove('invalid');

  if (!name.value.trim() || name.value.trim().split(/\s+/).length < 2) {
    showError('err-name');
    name.classList.add('invalid');
    valid = false;
  }

  if (!phone.value.trim() || phone.value.replace(/\D/g, '').length < 10) {
    showError('err-phone');
    phone.classList.add('invalid');
    valid = false;
  }

  if (!attendance) {
    showError('err-attendance');
    valid = false;
  }

  return valid;
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  successMsg.style.display = 'none';
  errorMsg.style.display = 'none';

  if (!validateForm()) return;

  submitBtn.disabled = true;
  submitBtn.textContent = 'Отправляем...';

  const templateParams = {
    to_email: 'cursedbaloo@gmail.com',
    guest_name: document.getElementById('guest-name').value.trim(),
    guest_phone: document.getElementById('guest-phone').value.trim(),
    attendance: getRadioValue('attendance'),
    food: getCheckedValues('food'),
    drinks: getCheckedValues('drinks'),
    guest_message: document.getElementById('guest-message').value.trim() || 'нет',
  };

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
    .then(function () {
      successMsg.style.display = 'block';
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = 'Отправить подтверждение';
    })
    .catch(function (err) {
      console.error('EmailJS error:', err);
      errorMsg.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Отправить подтверждение';
    });
});

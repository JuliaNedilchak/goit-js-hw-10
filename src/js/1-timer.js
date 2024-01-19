import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';
import izitoast from 'izitoast';
import 'izitoast/dist/css/izitoast.min.css';

const inputData = document.querySelector('#datetime-picker');
const button = document.querySelector('button');

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining day
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
button.addEventListener('click', convertMs);

console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}

let userSelectedDate;
let countInterval;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    clearInterval(countInterval);
    if (userSelectedDate.getTime() <= new Date().getTime()) {
      izitoast.error({
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      button.setAttribute('disabled', true);
    } else {
      button.removeAttribute('disabled');
    }
  },
};

const calendar = flatpickr(inputData, options);

function start() {
  inputData.setAttribute('disabled', true);
  countInterval = setInterval(updatedTimer, 1000);
  button.disabled = true;
}

function updatedTimer() {
  const now = new Date().getTime();
  const timeDifference = userSelectedDate.getTime() - now;
  if (timeDifference > 0) {
    const { days, hours, minutes, seconds } = convertMs(timeDifference);
    updateTimerDisplay(days, hours, minutes, seconds);
  } else {
    clearInterval(countInterval);
    updateTimerDisplay(0, 0, 0, 0);
    izitoast.success({
      title: 'Time out',
    });
  }
}
function addLeadingZero(value) {
  return value < 10 ? `0${value}` : value;
}
function updateTimerDisplay(days, hours, minutes, seconds) {
  document.querySelector('[data-days]').innerText = addLeadingZero(days);
  document.querySelector('[data-hours]').innerText = addLeadingZero(hours);
  document.querySelector('[data-minutes]').innerText = addLeadingZero(minutes);
  document.querySelector('[data-seconds]').innerText = addLeadingZero(seconds);
}
button.addEventListener('click', () => {
  if (userSelectedDate <= 0) {
    izitoast.error({
      message: 'Please choose a date in the future',
      position: 'topRight',
    });
  }
  const timeDifference = userSelectedDate.getTime() - new Date().getTime();
  if (timeDifference > 0) {
    start();
  }
});

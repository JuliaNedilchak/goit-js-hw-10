import iziToast from 'izitoast';
// Додатковий імпорт стилів
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');

function promiseCreate(event) {
  event.preventDefault();
  const delayValue = document.getElementsByName('delay')[0].value;
  const chosePromise = document.querySelectorAll('input[name = "state"]');
  let promiseOpt;
  Array.from(chosePromise).forEach(option => {
    if (option.checked) {
      promiseOpt = option.value;
    }
  });
  const promise = new Promise((res, rej) => {
    if (isNaN(delayValue) || delayValue >= 0) {
      setTimeout(() => {
        if (promiseOpt === 'fulfilled') {
          res(delayValue);
        } else {
          rej(delayValue);
        }
      }, delayValue);
    }
  });

  promise
    .then(value => {
      iziToast.show({
        title: `fulfilled promise in ${value}ms`,
        position: 'topRight',
        backgroundColor: 'green',
      });
    })
    .catch(error => {
      iziToast.show({
        title: `rejected promise in ${error}ms`,
        position: 'topRight',
        backgroundColor: 'red',
      });
    });
}
form.addEventListener('submit', promiseCreate);

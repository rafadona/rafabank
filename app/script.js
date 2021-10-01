'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP



// const account2 = {
//   owner: 'Jessica Davis',
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,
// };

// const account3 = {
//   owner: 'Steven Thomas Williams',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: 'Sarah Smith',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

// const accounts = [account1, account2, account3, account4];



const account1 = {
  owner: 'Rafael Dona',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2021-08-14T17:01:17.194Z',
    '2021-08-15T23:36:17.929Z',
    '2021-08-16T10:51:36.790Z',
  ],
  currency: 'BRL',
  locale: 'pt-BR',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2021-08-10T12:01:20.894Z',
  ],
  currency: 'BRL',
  locale: 'pt-BR',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const errorModal = document.querySelector('.modal');
const errorModalMessage = document.querySelector('.modal__p');
const errorModalTitle = document.querySelector('.modal__title');
const errorModalImage = document.getElementById('modal__img');
const btnModal = document.querySelector('.modal--btn');


let currentAccount, transferAccount, timer;



const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return `Hoje`;
  if (daysPassed === 1) return `Ontem`;
  if (daysPassed <= 7) return `${daysPassed} dias atrás`;

  return new Intl.DateTimeFormat(locale).format(date);

};

const formtarCur = function (value, locale, currency) {

  return new Intl.NumberFormat(locale, {
    style: `currency`,
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'entrada' : 'saída';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);
    const formatedMov = formtarCur(mov, acc.locale, acc.currency);


    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1
      } - ${type}</div>
      <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formatedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner.toLowerCase().split(` `).map(name => name[0]).join(``);
  });

};
createUsernames(accounts);


const calcBalance = function (acc) {
  const balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  return balance;
};

const createBalance = function (accs) {
  accs.forEach(function (acc) {
    acc.balance = calcBalance(acc);
  });
};
createBalance(accounts);

const calcDisplayBalance = function (acc) {
  labelBalance.textContent = formtarCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySumary = function (acc) {
  const inValue = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formtarCur(inValue, acc.locale, acc.currency);

  const outValue = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formtarCur(Math.abs(outValue), acc.locale, acc.currency);

  const interest = acc.movements.filter(mov => mov > 0).map(deposit => (deposit * acc.interestRate / 100)).filter(int => int >= 1).reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formtarCur(interest, acc.locale, acc.currency);

};

const showModal = function (message, title = 'Algo deu errado!', type = 'alert') {
  errorModal.classList.remove('hidden');
  errorModal.classList.remove('hide');

  errorModalTitle.textContent = `${title}`;
  errorModalMessage.textContent = `${message}`;
  errorModalImage.src = `./images/${type}.png`;

};

const updateUI = function (acc) {
  displayMovements(acc);
  calcDisplayBalance(acc);
  calcDisplaySumary(acc);
};


//fake always logged in
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;
///



const startLogoutTimer = function () {
  let time = 300;

  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);


    labelTimer.textContent = `${min}:${sec}`;


    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Faça o login em sua conta para começar`;
      containerApp.style.opacity = 0;
    }
    time--;
  };


  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};


btnLogin.addEventListener(`click`, function (e) {
  e.preventDefault();

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value.toLowerCase());

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Bem-vindo(a), ${currentAccount.owner.split(` `)[0]}`;
    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = ``;
    inputLoginPin.blur();
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();
    updateUI(currentAccount);
  } else {
    showModal('Verifique se o usuário e senha estão corretos.', 'Não foi possível logar!', 'alert');
    containerApp.style.opacity = 0;

  }
  const now = new Date();
  const options = {
    hour: `numeric`,
    minute: `numeric`,
    day: `numeric`,
    month: `numeric`,
    year: `numeric`,
    // weekday: `long`,
  };

  labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now);


});


btnTransfer.addEventListener(`click`, function (e) {
  e.preventDefault();

  transferAccount = accounts.find(acc => acc.username === inputTransferTo.value.toLowerCase());
  const amount = Number(inputTransferAmount.value);

  if (currentAccount.username !== ((inputTransferTo.value).toLowerCase()) && ((inputTransferTo.value).toLowerCase()) === transferAccount?.username) {
    if (currentAccount.balance < amount) {
      return showModal('A quantia da transferência é maior do que o seu saldo!', "Atenção!");
    } else if (amount <= 0) {
      return showModal('Quantia igual a zero!');
    }

    currentAccount.balance = currentAccount.balance - amount;
    currentAccount.movements.push(-amount);
    transferAccount.balance += amount;
    transferAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    transferAccount.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);

    showModal(`Transferência de R$ ${transferAccount.movements.slice(-1)} para ${transferAccount.owner} feita com sucesso!`, `Sucesso!`, 'success');

  } else {
    showModal('Por favor, preencha os campos corretamente.', "Não foi possível realizar a transferência!");
  }

  inputTransferAmount.value = inputTransferTo.value = ``;
  clearInterval(timer);
  timer = startLogoutTimer();

});


btnClose.addEventListener(`click`, function (e) {
  e.preventDefault();

  if (currentAccount.username === inputCloseUsername.value.toLowerCase() && currentAccount.pin === Number(inputClosePin.value)) {
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    accounts.splice(index, 1);
    showModal("Sua conta foi deletada com sucesso!", "Sucesso!", "success");
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Faça o login em sua conta para começar`;



  } else {
    return showModal('Por favor, preencha os campos corretamente.', "Não foi possível deletar sua conta!");
  }

  inputCloseUsername.value = inputClosePin.value = ``;
});


btnLoan.addEventListener(`click`, function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);
  const loan = currentAccount.movements.some(mov => mov >= (0.1 * amount));

  if (loan && amount > 0) {
    currentAccount.balance += amount;
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    showModal(`Quantia de R$${amount} foi concedida!`, 'Empréstimo aprovado!', 'success');
    updateUI(currentAccount);

  } else if (amount <= 0) {
    showModal('Por favor, preencha os campos corretamente.', "Não foi possível solicitar o empréstimo.");
  }


  inputLoanAmount.value = ``;
  clearInterval(timer);
  timer = startLogoutTimer();

});


let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

// criando uma array usando os valores que aparecem no DOM, usando Array.from()

labelBalance.addEventListener(`click`, function (e) {
  e.preventDefault();

  const movementsUI = Array.from(document.querySelectorAll(`.movements__value`), el => Number(el.textContent.replace(`€`, ``))

  );
  console.log(movementsUI);

  clearInterval(timer);
  timer = startLogoutTimer();

});

btnModal.addEventListener('click', function (e) {
  e.preventDefault();

  errorModal.classList.add('hide');
});
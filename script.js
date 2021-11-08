"use strict";

////////////////////////////////////////////////
////////////////////////////////////////////////

/// ADDD BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2,
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

/// ! Elements

const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

///  ? MY CODE  ///

//  => Display Movements

const addMovement = function (movement) {
  containerMovements.innerHTML = "";

  movement.forEach((mov, i) => {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}€</div>
    </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

//  => Display Balance to the DOM

const calcPrintBal = function (acc) {
  const bal = acc.movements.reduce((acc, mov) => acc + mov, 0);
  acc.balance = bal;
  labelBalance.textContent = `${bal} EUR`;
};

//  => Display Current Summery to the DOM

const calcPrintSummery = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov >= 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes} 💰`;
  const outcome = acc.movements
    .filter((mov) => mov < 0)
    .map((mov) => Math.abs(mov))
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${outcome} 💱`;
  const interest = acc.movements
    .filter((mov) => mov >= 0)
    .map((mov) => mov * (acc.interestRate / 100))
    .filter((mov) => mov >= 1)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${interest} 💸`;
};

//  => to add the UserName to the Accounts

const makeU = (accs) => {
  accs.forEach((acc) => {
    acc.UserName = acc.owner
      .toLowerCase()
      .split(" ")
      .map((ar) => ar[0])
      .join("");
  });
};
makeU(accounts);

const updateMovBalSumm = function (acc) {
  // => Display Movements
  addMovement(acc.movements);

  // => Display Balance
  calcPrintBal(acc);

  // => Display Summery
  calcPrintSummery(acc);
};

//////////////// * //////////////////   //////////////// * //////////////////

let currentAccount;

///  ! Event Handlers   ///

/// ? Login And Display UI, Movements, Balance, and Summery :

btnLogin.addEventListener("click", function (e) {
  //

  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.UserName === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //

    // => Display Movements Balance and Summery
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(` `)[0]
    }`;
    containerApp.style.opacity = 100;

    updateMovBalSumm(currentAccount);
  }

  // => Clear Inputs
  inputLoginUsername.value = inputLoginPin.value = "";
  inputLoginUsername.blur();
  inputLoginPin.blur();
});

/// ? Transfer money :    `find()`

//* inputTransferTo, inputTransferAmount, btnTransfer;
btnTransfer.addEventListener("click", function (e) {
  //

  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    (acc) => acc.UserName === inputTransferTo.value
  );
  if (
    amount > 0 &&
    amount <= currentAccount.balance &&
    recieverAcc &&
    recieverAcc?.UserName !== currentAccount.UserName
  ) {
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);

    // => update Movements Balance and Summery
    updateMovBalSumm(currentAccount);
  }

  // => Clear Inputs
  inputTransferTo.value = inputTransferAmount.value = "";
  inputTransferTo.blur();
  inputTransferAmount.blur();
});

/// ? Close Account

btnClose.addEventListener("click", function (e) {
  //

  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.UserName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const i = accounts.findIndex(
      (acc) => acc.UserName === currentAccount.UserName
    );

    // => Delete Account
    accounts.splice(i, 1);

    // => Hide the UI
    containerApp.style.opacity = 0;
  }

  // => Clear Inputs
  inputCloseUsername.value = inputClosePin.value = "";
  inputCloseUsername.blur();
  inputClosePin.blur();
});

/// ? Request a Loan =>

//* btnLoan, inputLoanAmount
btnLoan.addEventListener("click", function (e) {
  //

  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= 0.1 * amount)
  ) {
    currentAccount.movements.push(amount);
  }

  // => Update The UI
  updateMovBalSumm(currentAccount);

  // => Clear Inputs
  inputLoanAmount.value = "";
  inputLoanAmount.blur();
});
//////////////// % ////////////////////////////////// * ////////////////////////////////// % ////////////////////////////////// * //////

// ADDD LEC TURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

//////////////// * //////////////////   //////////////// * //////////////////

const eurToUsd = 1.1;

const transformed = movements.map((mov) => mov * eurToUsd);

/// ANOTHER =>

const arr = [];
for (const mov of movements) {
  const x = mov * eurToUsd;
  arr.push(x);
}

const strMov = movements.map((mov, i) => {
  const type = mov > 0 ? "deposite" : "withdrew";
  `operation number ${i + 1} : it\`s a ${type}, the amount is ${Math.abs(mov)}`;
});

const makeUserName = (str) =>
  str
    .toLowerCase()
    .split(" ")
    .map((ar) => ar[0])
    .join("");

const userNameArray = accounts.map((acc) => makeUserName(acc.owner));
makeU(accounts);

//////////////// * //////////////////   //////////////// * //////////////////

//=> to create an array with deposite or withdrew only =>

const deposite = movements.filter((mov) => mov > 0);
const withdrew = movements.filter((mov) => mov < 0);
// console.log(deposite, withdrew);

const depositeFor = [];
const withdrewFor = [];
for (const mov of movements) {
  mov > 0 && depositeFor.push(mov);
  mov < 0 && withdrewFor.push(mov);
}

//////////////// * //////////////////   //////////////// * //////////////////

const movementsBalance = movements.reduce((acc, mov) => acc + mov, 0);

let acc = 0;
for (const mov of movements) {
  acc += mov;
}

///

const biggest = movements.reduce((acc, mov) => {
  if (acc < mov) {
    acc = mov;
  }
  return acc;
}, movements[0]);

//////////////// * //////////////////   //////////////// * //////////////////

///  => Chaiin   ///

const totalDepositeDollars = movements
  .filter((mov) => mov > 0)
  .map((mov) => mov * eurToUsd)
  .reduce((acc, mov) => acc + mov, 0);

//////////////// * //////////////////   //////////////// * //////////////////

const rand = Array.from({ length: 100 }, () =>
  Math.trunc(Math.random() * 6 + 1)
);
// console.log(rand);

const allOp = function (accs) {
  const oneValue = accs.map((acc) =>
    acc.movements.reduce((acu, mov) => acu + mov, 0)
  );
  // console.log(oneValue);
  const sum = oneValue.reduce((al, va) => al + va, 0);
  // console.log(sum);
};

allOp(accounts);

const allDepo = function (accs) {
  const newArr = accs.map((acc) =>
    acc.movements.filter((mov) => mov > 0).reduce((a, alw) => a + alw, 0)
  );
  // console.log(newArr.reduce((a, mov) => a + mov, 0));
};
allDepo(accounts);

const how1000 = accounts
  .flatMap((acc) => acc.movements)
  .filter((mov) => mov >= 1000).length;
// console.log(how1000);
const red = accounts
  .flatMap((acc) => acc.movements)
  .reduce((w, cur) => {
    cur >= 1000 && w++;
    return w;
  }, 0);
// console.log(red);

const sums = accounts
  .flatMap((acc) => acc.movements)
  .reduce(
    (accc, cur) => {
      cur > 0 ? (accc.deposite += cur) : (accc.withdrawal += -cur);
      return accc;
    },
    { deposite: 0, withdrawal: 0 }
  );
// console.log(sums);

const allDepos = accounts.reduce((accum, curr) => {
  accum.push(curr.movements);
  return accum;
}, []);
// console.log(allDepos);
const a7eh = allDepos.reduce((a7a, movArr) => a7a.concat(movArr), []);
// console.log(a7eh);

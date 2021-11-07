'use strict';

////////////////////////////////////////////////
////////////////////////////////////////////////

/// ADDD BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2,
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

///   NOTICE Elements

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

///  ? MY CODE  ///

// TODO => Display Movements

const addMovement = function (movement) {
  containerMovements.innerHTML = '';

  movement.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}€</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// TODO => Display Balance to the DOM

const calcPrintBal = function (acc) {
  const bal = acc.movements.reduce((acc, mov) => acc + mov, 0);
  acc.balance = bal;
  labelBalance.textContent = `${bal} EUR`;
};

// TODO => Display Current Summery to the DOM

const calcPrintSummery = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov >= 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes} 💰`;
  const outcome = acc.movements
    .filter(mov => mov < 0)
    .map(mov => Math.abs(mov))
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${outcome} 💱`;
  const interest = acc.movements
    .filter(mov => mov >= 0)
    .map(mov => mov * (acc.interestRate / 100))
    .filter(mov => mov >= 1)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${interest} 💸`;
};

// TODO => to add the UserName to the Accounts

const makeU = accs => {
  accs.forEach(acc => {
    acc.UserName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(ar => ar[0])
      .join('');
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

btnLogin.addEventListener('click', function (e) {
  //

  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.UserName === inputLoginUsername.value
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
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginUsername.blur();
  inputLoginPin.blur();
});

/// ? Transfer money :    `find()`

//* inputTransferTo, inputTransferAmount, btnTransfer;
btnTransfer.addEventListener('click', function (e) {
  //

  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    acc => acc.UserName === inputTransferTo.value
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
  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferTo.blur();
  inputTransferAmount.blur();
});

/// ? Close Account       `findIndex()`

//* inputClosePin,inputCloseUsername,btnClose;
btnClose.addEventListener('click', function (e) {
  //

  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.UserName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const i = accounts.findIndex(
      acc => acc.UserName === currentAccount.UserName
    );

    // => Delete Account
    accounts.splice(i, 1);

    // => Hide the UI
    containerApp.style.opacity = 0;
  }

  // => Clear Inputs
  inputCloseUsername.value = inputClosePin.value = '';
  inputCloseUsername.blur();
  inputClosePin.blur();
});

/// ? Request a Loan =>     `some()`

//* btnLoan, inputLoanAmount
btnLoan.addEventListener('click', function (e) {
  //

  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= 0.1 * amount)) {
    currentAccount.movements.push(amount);
  }

  // => Update The UI
  updateMovBalSumm(currentAccount);

  // => Clear Inputs
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});
//////////////// % ////////////////////////////////// * ////////////////////////////////// % ////////////////////////////////// * //////

// ADDD LEC TURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

///  ! forEach () `METHOD`   ///

// console.log(...movementss.entries());
// [...movementss.entries()].forEach(([nu, element]) => {
//   console.log(`operation Number ${nu}, the amount ${element}`);
// });
{
  /* <div class="movements__row">
    <div class="movements__type movements__type--deposit">2 deposit</div>
    <div class="movements__date">3 days ago</div>
    <div class="movements__value">4 000€</div>
    </div>; 
    */
}
// console.log(movements);

//////////////// * //////////////////   //////////////// * //////////////////

///  ! map () `METHOD`   ///

const eurToUsd = 1.1;

const transformed = movements.map(mov => mov * eurToUsd);

/// ANOTHER =>

const arr = [];
for (const mov of movements) {
  const x = mov * eurToUsd;
  arr.push(x);
}
// console.log(arr, transformed);
// console.log(`__________________________________________`);

const strMov = movements.map((mov, i) => {
  const type = mov > 0 ? 'deposite' : 'withdrew';
  `operation number ${i + 1} : it\`s a ${type}, the amount is ${Math.abs(mov)}`;
});

///   ?   ///

///  TODO create an array of the PW =>

const makeUserName = str =>
  str
    .toLowerCase()
    .split(' ')
    .map(ar => ar[0])
    .join('');

const userNameArray = accounts.map(acc => makeUserName(acc.owner));
// console.log(userNameArray);

/// TODO to add the PW to the Objects =>

// const makeU = accs => {
//   accs.forEach(acc => {
//     acc.UserName = acc.owner
//       .toLowerCase()
//       .split(' ')
//       .map(ar => ar[0])
//       .join('');
//   });
// };
makeU(accounts);
// console.log(account1);
// console.log(account2);
// console.log(account3);
// console.log(account4);

//////////////// * //////////////////   //////////////// * //////////////////

///  ! filter () `METHOD`   ///

// to create an array with deposite or withdrew only =>

const deposite = movements.filter(mov => mov > 0);
const withdrew = movements.filter(mov => mov < 0);
// console.log(deposite, withdrew);

/// ANOTHER =>

const depositeFor = [];
const withdrewFor = [];
for (const mov of movements) {
  mov > 0 && depositeFor.push(mov);
  mov < 0 && withdrewFor.push(mov);
}
// console.log(depositeFor, withdrewFor);

//////////////// * //////////////////   //////////////// * //////////////////

///  ! reduce () `METHOD`   ///   => return `ONE VALUE`

//   reduce ( callbackFN (acc, currArrValu,Index, Arr) => {}  , initialValue of acc )

const movementsBalance = movements.reduce((acc, mov) => acc + mov, 0);
// console.log(movementsBalance);

/// ANOTHER =>

let acc = 0;
for (const mov of movements) {
  acc += mov;
}
// console.log(acc);

///

const biggest = movements.reduce((acc, mov) => {
  if (acc < mov) {
    acc = mov;
  }
  // console.log(acc);
  return acc;
}, movements[0]);
// console.log(biggest);

//////////////// * //////////////////   //////////////// * //////////////////

///  => Chaiin   ///

const totalDepositeDollars = movements
  .filter(mov => mov > 0)
  .map(mov => mov * eurToUsd)
  .reduce((acc, mov) => acc + mov, 0);
// console.log(totalDepositeDollars);

//////////////// * //////////////////   //////////////// * //////////////////

///   ? CODE CHALLENGE 1   ///

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

const checkDogs = function (arr1, arr2) {
  const corc = arr1.slice(1, -2);

  /// ANOTHER    => //    const corc = arr1.slice()   =>  arr1.splice(0,1)    then  arr1.splice(-2,2)

  const data = [...corc, ...arr2];
  data.forEach((dog, i) => {
    const type = dog >= 3 ? 'an adult 🐕‍🦺' : 'still a puppy 🐩';
    console.log(`Dog number ${i + 1} is ${type}, and is ${dog} years old !`);
  });
};

// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
// console.log(`__________________________________________`);
// checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

//////////////// * //////////////////   //////////////// * //////////////////

///   ? CODE CHALLENGE 2   ///

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

///  => My Answer

// const calcAverageHumanAge = function (ages) {
//   const ageArr = ages.map(dog => (dog <= 2 ? 2 * dog : 16 + dog * 4));
//   const oldDogs = ageArr.filter(dog => dog >= 18);
//   const ageAvg =
//     oldDogs.reduce((acc, dog) => {
//       acc += dog;
//       return acc;
//     }, 0) / oldDogs.length;
//   console.log(ageArr, oldDogs, ageAvg);
// };

// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

//////////////// * //////////////////   //////////////// * //////////////////

///   ? CODE CHALLENGE 3   ///

/* 
Rewrite the 'calcAverageHumanAge' function from the previous challenge, but this time as an arrow function, and using chaining!

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

const calcAverageHumanAge = function (ages) {
  const avg = ages
    .map(dog => (dog <= 2 ? 2 * dog : 16 + dog * 4))
    .filter(dog => dog >= 18)
    .reduce((acc, dog, _i, arr) => acc + dog / arr.length, 0);

  // console.log(avg);
};
calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);

////////////////////////////

const rand = Array.from({ length: 100 }, () =>
  Math.trunc(Math.random() * 6 + 1)
);
// console.log(rand);

const allOp = function (accs) {
  const oneValue = accs.map(acc =>
    acc.movements.reduce((acu, mov) => acu + mov, 0)
  );
  // console.log(oneValue);
  const sum = oneValue.reduce((al, va) => al + va, 0);
  // console.log(sum);
};

allOp(accounts);

const allDepo = function (accs) {
  const newArr = accs.map(acc =>
    acc.movements.filter(mov => mov > 0).reduce((a, alw) => a + alw, 0)
  );
  // console.log(newArr.reduce((a, mov) => a + mov, 0));
};
allDepo(accounts);

const how1000 = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov >= 1000).length;
// console.log(how1000);
const red = accounts
  .flatMap(acc => acc.movements)
  .reduce((w, cur) => {
    cur >= 1000 && w++;
    return w;
  }, 0);
// console.log(red);

const sums = accounts
  .flatMap(acc => acc.movements)
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

const titleCase = function (str) {
  const newArr = str.split(' ').map(word => {
    if (word === 'a' || word === 'in') {
      return word;
    } else {
      const [upp, ...other] = word;
      return upp.toUpperCase() + other.join('');
    }
  });
  // console.log(newArr);
};
titleCase('a7a ya balad a in movies');

///////////////////////////////////////
// Coding Challenge #4

/* 

4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

*/
/// => TEST DATA:

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];
dogs.forEach(obj => {
  const recommendedFood = obj.weight ** 0.75 * 28;
  obj.recommendedFood = recommendedFood;
  console.log(obj);
});

const meeh = dogs.map(obj => {
  if (obj.owners.includes('Sarah')) {
    console.log(
      `Ur dog is eating too ${
        obj.recommendedFood > obj.curFood ? 'little' : 'much'
      }`
    );
  }
});
const ownersEatTooMuch = [];
const ownersEatTooLittle = [];
dogs.forEach(obj => {
  obj.curFood > obj.recommendedFood
    ? ownersEatTooMuch.push(...obj.owners)
    : ownersEatTooLittle.push(...obj.owners);
});

const fu = function (obj) {
  return (
    obj.curFood > obj.recommendedFood * 0.9 &&
    obj.curFood < obj.recommendedFood * 1.1
  );
};

const does = dogs.some(obj => obj.curFood === obj.recommendedFood);
const okey = dogs.some(fu);
const okeyArr = dogs.filter(fu);
console.log(ownersEatTooLittle, ownersEatTooMuch);
console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);
console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too much!`);
console.log(does, okey);
console.log(okeyArr);

// 8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

const shallow = dogs
  .slice()
  .sort((a, b) => a.recommendedFood - b.recommendedFood);
console.log(shallow);

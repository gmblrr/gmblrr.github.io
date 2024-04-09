const SITE_DISABLED = 0;
const CRASH_CHANCE = 0.4999998;
const ROCKET_SPEED = 2000; // ms
const RESPAWN_SPEED = 840; // ms
const ERROR_AWARD = 3.4; // The amount of times cash is multiplied if the cash is below the bet amount

document.addEventListener('DOMContentLoaded', () => {
    initialize(); // Call initialize function when the DOM content is loaded
});

if (SITE_DISABLED == 1) {
  alert("As of right now crash is not working. Will fix by tommorow. Sorry!\nFor now, here's a funny game.");
  window.location.href = "/gamblr/games/fazwipe/";
}

function initialize() {
  const rocket = document.getElementById('rocket');
  updateCashDisplay();
  rocket.style.backgroundImage = "url('/gamblr/images/rocket.png')";
  document.getElementById('bet-button').addEventListener('click', placeBet);
}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function updateCashDisplay() {
  const cashValue = parseFloat(localStorage.getItem('cash')) || 0;
  var formattedCash = parseFloat(cashValue).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  document.getElementById('cash-value').textContent = formattedCash;
}

function resetRocket() {
  const rocket = document.getElementById('rocket');
  rocket.style.transition = 'opacity 0.6s ease-in-out';
  rocket.style.opacity = '0';

  setTimeout(() => {
    rocket.style.transition = 'none';
    rocket.style.backgroundImage = "url('/gamblr/images/rocket.png')";
    rocket.style.bottom = '0';
    rocket.style.left = '0';
    rocket.offsetHeight;
    rocket.style.transition = 'none';
    document.getElementById('bet-button').disabled = false;
    rocket.offsetHeight;
    rocket.style.transition = 'opacity 0.7s ease-in-out';
    rocket.style.opacity = '1';
  }, RESPAWN_SPEED);
}

function displayResult(message) {
  document.getElementById('result').textContent = message;
}

function placeBet() {
  const betAmount = parseFloat(document.getElementById('bet-amount').value);
  let cashValue = parseFloat(localStorage.getItem('cash')) || 0;
  
  document.getElementById('bet-button').disabled = true;
  
  if (isNaN(betAmount) || betAmount <= 0 || betAmount > cashValue) {
    displayResult('Invalid bet or insufficient funds!');
    document.getElementById('bet-button').disabled = false;
    return;
  }

  const ascent = 260;
  const forward = 300;
  const crashChance = Math.random();

  const rocket = document.getElementById('rocket');
  const rocketContainer = document.getElementById('rocket-container');

  const containerWidth = rocketContainer.clientWidth;
  const containerHeight = rocketContainer.clientHeight;

  const rocketWidth = rocket.offsetWidth;
  const rocketHeight = rocket.offsetHeight;

  const maxForward = containerWidth - rocketWidth;
  const maxAscent = containerHeight - rocketHeight;

  const newForward = Math.min(maxForward, forward);
  const newAscent = Math.min(maxAscent, ascent);

  rocket.style.transition = 'bottom 2s ease-in-out, left 2s ease-in-out';
  rocket.style.bottom = newAscent + 'px';
  rocket.style.left = newForward + 'px';
  displayResult("🚀 ...");

  setTimeout(() => {
    let lostAmount = betAmount;
    let actualWonAmount = 0;

    if (crashChance < CRASH_CHANCE) {
      displayResult(`💥 The rocket exploded. You lost $${betAmount.toLocaleString()}!`);
      rocket.style.backgroundImage = "url('/gamblr/images/boom.png')";
      setTimeout(resetRocket, 1000);
      cashValue -= betAmount; // Deduct bet amount from cash
    } else {
      const randomMultiplier = randomIntFromInterval(1, 3);
      let wonAmount = betAmount * randomMultiplier;
      
      if (wonAmount < (betAmount + 0.5)) {
        wonAmount *= ERROR_AWARD;
      }

      actualWonAmount = wonAmount - betAmount;
      displayResult(`🌑 The rocket made it! You won $${actualWonAmount.toLocaleString()}!`);
      setTimeout(resetRocket, 480);
      cashValue += actualWonAmount; // Add winnings to cash
    }

    localStorage.setItem('cash', cashValue.toFixed(2));
    updateCashDisplay();
  }, ROCKET_SPEED);
}

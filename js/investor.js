 localStorage.removeItem('historyData');
 let cash = parseFloat(localStorage.getItem("cash")) || 100;
 let stockPrice = parseFloat(localStorage.getItem("stockPrice")) || 50.00;
 let sharesOwned = parseInt(localStorage.getItem("sharesOwned")) || 0;
 let trend = 1;
 let historyData = [];
 const maxPoints = 30;

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function updateDisplay() {
    document.getElementById("cashDisplay").textContent = numberWithCommas(cash.toFixed(2));
    document.getElementById("stockPrice").textContent = numberWithCommas(stockPrice.toFixed(2));
    document.getElementById("sharesOwned").textContent = numberWithCommas(sharesOwned);
}



 function buy() {
 	const amount = parseInt(document.getElementById("amountInput").value);
 	if(isNaN(amount) || amount <= 0) {
 		alert("Please enter a valid amount.");
 		return;
 	}
 	if(amount * stockPrice <= cash) {
 		cash -= amount * stockPrice;
 		sharesOwned += amount;
 		localStorage.setItem("cash", cash);
 		localStorage.setItem("sharesOwned", sharesOwned);
 		updateDisplay();
 	}
 	else {
 		alert("Insufficient funds!");
 	}
 }

 function sell() {
 	const amount = parseInt(document.getElementById("amountInput").value);
 	if(isNaN(amount) || amount <= 0) {
 		alert("Please enter a valid amount.");
 		return;
 	}
 	if(amount <= sharesOwned) {
 		cash += amount * stockPrice;
 		sharesOwned -= amount;
 		localStorage.setItem("cash", cash);
 		localStorage.setItem("sharesOwned", sharesOwned);
 		updateDisplay();
 	}
 	else {
 		alert("You don't own enough shares!");
 	}
 }

 function fluctuateStockPrice() {
 	const randomChange = Math.random() * 30 - 15;
 	const canvas = document.getElementById('stockChart');
 	const ctx = canvas.getContext('2d');
 	if(Math.random() < 0.1) {
 		trend *= -1;
 	}
 	stockPrice += trend * randomChange;
 	if(stockPrice < 0) {
 		stockPrice = 50.00;
 		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
 	}
 	localStorage.setItem("stockPrice", stockPrice);
 	historyData.push(stockPrice);
 	if(historyData.length > maxPoints) {
 		historyData.shift();
 	}
 	updateDisplay();
 	drawChart();
 }

 function drawChart() {
 	const canvas = document.getElementById('stockChart');
 	const ctx = canvas.getContext('2d');
 	const maxPrice = Math.max(...historyData) + 10;
 	const minPrice = Math.min(...historyData) - 10;
 	const canvasWidth = canvas.width;
 	const canvasHeight = canvas.height;
 	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
 	ctx.beginPath();
 	ctx.strokeStyle = 'black';
 	ctx.moveTo(50, 10);
 	ctx.lineTo(50, canvasHeight - 20);
 	ctx.lineTo(canvasWidth - 20, canvasHeight - 20);
 	ctx.stroke();
 	ctx.lineWidth = 2;
 	ctx.beginPath();
 	for(let i = 0; i < historyData.length; i++) {
 		const x = 50 + (canvasWidth - 70) / (maxPoints - 1) * i;
 		const y = canvasHeight - 20 - (historyData[i] - minPrice) / (maxPrice - minPrice) * (canvasHeight - 30);
 		if(i === historyData.length - 1) {
 			if(i > 0 && historyData[i] > historyData[i - 1]) {
 				ctx.strokeStyle = 'green';
 			}
 			else if(i > 0 && historyData[i] < historyData[i - 1]) {
 				ctx.strokeStyle = 'red';
 			}
 			else {
 				ctx.strokeStyle = 'blue';
 			}
 		}
 		else {
 			ctx.strokeStyle = 'blue';
 		}
 		if(i === 0) {
 			ctx.moveTo(x, y);
 		}
 		else {
 			ctx.lineTo(x, y);
 		}
 	}
 	ctx.stroke();
 }

document.addEventListener("DOMContentLoaded", function() {
  updateDisplay();
  setInterval(fluctuateStockPrice, 1000);
});

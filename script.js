let trades = JSON.parse(localStorage.getItem("trades")) || [];

let balance = Number(localStorage.getItem("balance")) || 1000;

const form = document.getElementById("tradeForm");

form.addEventListener("submit", function(e){
e.preventDefault();

const trade = {
date: date.value,
pair: pair.value,
profit: Number(profit.value)
};

trades.push(trade);

saveData();
renderTable();

form.reset();
});

function saveData(){
localStorage.setItem("trades", JSON.stringify(trades));
}

function renderTable(){

const table = document.getElementById("tradeTable");
table.innerHTML="";

let wins=0;
let totalProfit=0;

trades.forEach((trade,index)=>{

if(trade.profit>0) wins++;

totalProfit += trade.profit;

table.innerHTML += `
<tr>
<td>${trade.date}</td>
<td>${trade.pair}</td>
<td>${trade.profit}</td>
<td>
<button onclick="deleteTrade(${index})">
❌
</button>
</td>
</tr>
`;
});

document.getElementById("totalTrades").innerText=trades.length;

document.getElementById("winRate").innerText=
trades.length
?
((wins/trades.length)*100).toFixed(1)+"%"
:
"0%";

document.getElementById("totalProfit").innerText=
"$"+totalProfit.toFixed(2);
}

function deleteTrade(index){
trades.splice(index,1);
saveData();
renderTable();
}

document.getElementById("exportBtn")
.addEventListener("click",()=>{

let csv =
"Date,Pair,Profit\n";

trades.forEach(t=>{
csv += `${t.date},${t.pair},${t.profit}\n`;
});

const blob =
new Blob([csv],
{type:"text/csv"});

const a =
document.createElement("a");

a.href=
URL.createObjectURL(blob);

a.download=
"trading_journal.csv";

a.click();
});

renderTable();
updateBalance();

function updateBalance() {

let totalProfit = trades.reduce(
(sum,t)=>sum+t.profit,0
);

document.getElementById("currentBalance").innerText =
"$" + (balance + totalProfit).toFixed(2);

drawChart();
}

function drawChart(){

const ctx =
document.getElementById("equityChart");

let equity = balance;
let data = [];

trades.forEach(t=>{
equity += t.profit;
data.push(equity);
});

if(window.myChart){
window.myChart.destroy();
}

window.myChart = new Chart(ctx,{
type:'line',
data:{
labels:data.map((_,i)=>`Trade ${i+1}`),
datasets:[{
label:'Equity Curve',
data:data,
tension:0.3
}]
}
});
  }

let trades = JSON.parse(localStorage.getItem("trades")) || [];

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

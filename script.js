const form = document.getElementById("stpForm");
const tableBody = document.querySelector("#logTable tbody");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  // Get values properly
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const operatorName = document.getElementById("operatorName").value;
  const siteName = document.getElementById("siteName").value;
  const shiftDetails = document.getElementById("shiftDetails").value;
  const inletFlow = document.getElementById("inletFlow").value;
  const outletFlow = document.getElementById("outletFlow").value;
  const sv30 = document.getElementById("sv30").value;
  const cod = document.getElementById("cod").value;
  const doValue = document.getElementById("do").value;
  const ph = document.getElementById("ph").value;

  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${date}</td>
    <td>${time}</td>
    <td>${operatorName}</td>
    <td>${siteName}</td>
    <td>${shiftDetails}</td>
    <td>${inletFlow}</td>
    <td>${outletFlow}</td>
    <td>${sv30}</td>
    <td>${cod}</td>
    <td>${doValue}</td>
    <td>${ph}</td>
     <td>
    <button class="delete-btn">Delete</button>
  </td>
  `;

  tableBody.appendChild(row);

  fetch("https://script.google.com/macros/s/AKfycbxgo5nn24O5Lsqe3nzyhA3ncoRD-NT-LMj3KwjbtwmzvF2Bcnh0oUwi511J5wAKwGNn-A/exec", {
  method: "POST",
  body: JSON.stringify({
    date,
    time,
    operatorName,
    siteName,
    shiftDetails,
    inletFlow,
    outletFlow,
    sv30,
    cod,
    doValue,
    ph
  })
})
.then(res => res.json())
.then(data => {
  console.log("Saved to Google Sheet");
});

row.querySelector(".delete-btn").addEventListener("click", function () {
  if (confirm("Are you sure you want to delete this entry?")) {
    row.remove();
  }
});

  // Preserve operator & site
  const savedOperator = operatorName;
  const savedSite = siteName;

  form.reset();

  document.getElementById("operatorName").value = savedOperator;
  document.getElementById("siteName").value = savedSite;
});

function exportExcel() {
  const table = document.getElementById("logTable").outerHTML;
  const url = 'data:application/vnd.ms-excel,' + encodeURIComponent(table);
  const a = document.createElement("a");
  a.href = url;
  a.download = "STP_Daily_Log.xls";
  a.click();
}

function exportPDF() {
  const content = document.getElementById("logTable").outerHTML;
  const win = window.open("");
  win.document.write("<h2>STP Daily Operation Log</h2>" + content);
  win.document.close();
  win.print();
}
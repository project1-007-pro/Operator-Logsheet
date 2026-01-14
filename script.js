const form = document.getElementById("stpForm");
const tableBody = document.querySelector("#logTable tbody");

/* ==================================
   STORAGE FOR PREVIOUS DATA
================================== */
let previousRows = [];

/* ==================================
   DATE FORMAT FIX
   Converts ISO date to YYYY-MM-DD
================================== */
function formatDate(dateValue) {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  return date.toISOString().split("T")[0];
}

/* ==================================
   TIME FORMAT FIX
   Converts time from Sheets/ISO to HH:MM:SS
================================== */
function formatTime(timeValue) {
  if (!timeValue) return "";

  // If it's a string like "06:21:50" already
  if (typeof timeValue === "string" && timeValue.includes(":")) {
    return timeValue;
  }

  // If it's a number or date from Sheets
  const date = new Date(timeValue);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

/* ==================================
   VIEW PREVIOUS DATA (DATE RANGE)
================================== */
function viewPreviousData() {
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;

  if (!startDate || !endDate) {
    alert("Please select Start Date and End Date");
    return;
  }

  // Hide all previous rows
  previousRows.forEach(row => {
    row.style.display = "none";
  });

  // Show only rows within selected date range
  previousRows.forEach(row => {
    const rowDate = row.cells[0].innerText;
    if (rowDate >= startDate && rowDate <= endDate) {
      row.style.display = "table-row";
    }
  });
}

/* ==================================
   CLEAR PREVIOUS DATA VIEW
================================== */
function clearPreviousData() {
  previousRows.forEach(row => {
    row.style.display = "none";
  });

  document.getElementById("startDate").value = "";
  document.getElementById("endDate").value = "";
}

/* ==================================
   ADD PREVIOUS ROW (HIDDEN)
================================== */
function addPreviousRow(rowData) {
  const row = document.createElement("tr");
  row.style.display = "none";

  row.innerHTML = `
    <td>${formatDate(rowData[0])}</td>
    <td>${formatTime(rowData[1])}</td>
    <td>${rowData[2]}</td>
    <td>${rowData[3]}</td>
    <td>${rowData[4]}</td>
    <td>${rowData[5]}</td>
    <td>${rowData[6]}</td>
    <td>${rowData[7]}</td>
    <td>${rowData[8]}</td>
    <td>${rowData[9]}</td>
    <td>${rowData[10]}</td>
  `;

  tableBody.appendChild(row);
  previousRows.push(row);
}

/* ==================================
   FORM SUBMIT (NEW ENTRY)
================================== */
form.addEventListener("submit", function (e) {
  e.preventDefault();

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

  // New entry row (always visible)
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
  `;
  tableBody.appendChild(row);

  // Save to Google Sheet
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
  });

  // Preserve operator & site
  const savedOperator = operatorName;
  const savedSite = siteName;

  form.reset();
  document.getElementById("operatorName").value = savedOperator;
  document.getElementById("siteName").value = savedSite;
});

/* ==================================
   LOAD PREVIOUS DATA FROM SHEET
================================== */
window.addEventListener("load", function () {
  fetch("https://script.google.com/macros/s/AKfycbxgo5nn24O5Lsqe3nzyhA3ncoRD-NT-LMj3KwjbtwmzvF2Bcnh0oUwi511J5wAKwGNn-A/exec")
    .then(res => res.json())
    .then(data => {
      data.forEach(row => addPreviousRow(row));
    })
    .catch(err => console.error("Error loading data", err));
});

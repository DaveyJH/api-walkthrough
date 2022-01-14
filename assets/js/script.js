const API_KEY = "tzErvX7k4QJepaFcMUNkII5Iz5E";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

document.getElementById("status").addEventListener("click", e => getStatus(e));

async function getStatus (e) {
  const queryString = `${API_URL}?api_key=${API_KEY}`;
  const response = await fetch(queryString);
  const data = await response.json();

  if (response.ok) {
    displayStatus(data);
  } else {
    displayException(data);
    throw new Error(data.error);
  }
}

document.getElementById("submit").addEventListener("click", (e) => postForm(e));

function displayStatus(data) {
  const content = `<div>Your key is valid until</div>
  <div class="key-status">${data.expiry}</div>`;
  document.getElementById("resultsModalTitle").textContent = "API Key Status";
  document.getElementById("results-content").innerHTML = content;
  resultsModal.show();
}

function displayErrors(data) {
  let heading = `JSHint Results for ${data.filename}`;
  let result;
  if (data.total_errors === 0) {
    result = `<div class="no_errors">No errors reported!</div>`;
  } else {
    result = `<div>Total Errors: <span class="error_count">`;
    result =+ `${data.total_errors}</span></div>`;
    for (let error of data.error_list) {
      result += `<div>At line <span class="line">${error.line}</span>, `;
      result += `column <span class="column">${error.col}</span></div>`;
      result += `<div class="error">${error.error}</div>`;
    }
  }
  document.getElementById("resultsModalTitle").textContent = heading;
  document.getElementById("results-content").innerHTML = result;
  resultsModal.show();

}

function processOptions(form) {
  let optArray = []
  for (let entry of form.entries()) {
    if (entry[0] === "options") {
      optArray.push(entry[1]);
    }
  }
  form.delete("options");
  form.append("options", optArray.join());

  return form;
}

function displayException(data) {
  let heading = "An Exception Occurred";
  let status = data.status_code;
  let errorNo = data.error_no;
  let errorText = data.error;
  let result = `<div>The API returned status code ${status}</div>`;
  result += `<div>Error number: <span style="font-weight: bold;">`;
  result += `${errorNo}</span></div>`;
  result += `<div>Error text: <span style="font-weight: bold;">`;
  result += `${errorText}</span></div>`;
  document.getElementById("resultsModalTitle").textContent = heading;
  document.getElementById("results-content").innerHTML = result;
  resultsModal.show();
  
}

async function postForm(e) {
  const form = processOptions(
    new FormData(document.getElementById("checksform")));

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
                "Authorization": API_KEY,
              },
    body: form,
  });
  const data = await response.json();

  if (response.ok) {
    displayErrors(data);
  } else {
    displayException(data);
    throw new Error(data.error);
  }

}
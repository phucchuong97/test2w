const table = document.querySelector(".table");
const inputN = document.querySelector("#n");
const inputM = document.querySelector("#m");
const buttonShow = document.querySelector(".show");
let header, topOfheader;
let data;

function generateMTable(data) {
  table.innerHTML = "";
  let header = document.createElement("div");
  header.classList.add("header");
  for (let i in data[0]) {
    let ele = document.createElement("div");
    ele.innerHTML = i;
    header.appendChild(ele);
  }
  table.appendChild(header);

  for (let i in data) {
    let row = document.createElement("div");
    row.classList.add(`col${i}`);
    for (let j in data[0]) {
      let ele = document.createElement("div");
      ele.innerHTML = data[i][j];
      row.appendChild(ele);
    }
    table.appendChild(row);
  }
  document.documentElement.style.setProperty(
    "--col-nums",
    Object.keys(data[0]).length
  );
}

function mRandom(n) {
  return Math.round(Math.random() * (n+1));
}

function generateData(n, m) {
  let temp = [];
  for (let i = 0; i < n; i++) {
    let row = {};
    for (let j = 1; j <= m; j++) {
      row[j] = mRandom(1000);
    }
    temp.push(row);
  }
  return temp;
}

function showData() {
  const n = inputN.value;
  const m = inputM.value;
  data = generateData(n, m);
  generateMTable(data);
  header = document.querySelector(".header");
  topOfheader = header.offsetTop;
  const colums = header.querySelectorAll("div");
  colums.forEach(colums => colums.addEventListener("click", sortByColum));
}

function sortByColum() {
  console.log(this.innerHTML);
  const attribute = this.innerHTML;
  data.sort((a, b) => {
    return a[attribute] > b[attribute] ? 1 : -1;
  });
  generateMTable(data);
  header = document.querySelector(".header");
  topOfheader = header.offsetTop;
  const colums = header.querySelectorAll("div");
  colums.forEach(colums => colums.addEventListener("click", sortByColum));
}

function fixHeader() {
  if (window.scrollY >= topOfheader) {
    document.body.style.paddingTop = header.offsetHeight + "px";
    document.body.classList.add("fixed-header");
  } else {
    document.body.style.paddingTop = 0;
    document.body.classList.remove("fixed-header");
  }
}

buttonShow.addEventListener("click", showData);
window.addEventListener("scroll", fixHeader);

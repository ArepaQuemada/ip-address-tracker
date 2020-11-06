let mymap;
let host = `https://geo.ipify.org/api/v1?apiKey=at_EmBIh1a4MXfVwkPgtIjNSqsmD0Vx2&`;

fetch("https://api64.ipify.org?format=json")
  .then((r) => r.json())
  .then((r) => fetchInfoMap(host.concat(`ipAddress=${r.ip}`)));

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const value = document.querySelector("input").value;
  const url = isIp(value)
    ? host.concat(`ipAddress=${value}`)
    : host.concat(`domain=${value}`);

  if (mymap) {
    mymap.remove();
    mymap = null;
  }
  fetchInfoMap(url);
});

const fetchInfoMap = (url) => {
  const infoArrayElement = document.querySelectorAll(".info");

  fetch(url)
    .then((r) => r.json())
    .then((r) => {
      const {
        ip,
        isp,
        location: { city = "", country, postalCode, timezone, lat, lng } = {},
      } = r;
      const responseArray = [
        {
          value: ip,
        },
        {
          value:
            city || code || postalCode
              ? `${city}, ${country} \n ${postalCode}`
              : "",
        },
        {
          value: `UTC${timezone}`,
        },
        {
          value: isp,
        },
      ];

      infoArrayElement.forEach((e, index) => {
        e.textContent = responseArray[index].value;
      });
      showMap(lat, lng);
    })
    .catch((err) => {
      infoArrayElement.forEach(e => e.textContent = '');
    });
};

const showMap = (lat, lng) => {
  mymap = L.map("mapid", {
    zoomControl: false,
    maxZoom: 18,
    zoomOfset: -1,
  }).setView([lat, lng], 100);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mymap);

  L.marker([lat, lng]).addTo(mymap).openPopup();
};

const isIp = (value) => value.split(".").every((n) => n >= 0 && n <= 255);

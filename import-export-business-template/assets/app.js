const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const nav = document.querySelector(".nav");
const themes = ["light", "ocean", "dark"];
const themeLabels = {
  light: "Light",
  ocean: "Ocean",
  dark: "Dark"
};

initThemeSwitcher();
setCurrentNavLink();
initTradeMap();

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
}

document.querySelectorAll("[data-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = form.querySelector(".form-status");
    const formName = form.dataset.form;
    const payload = Object.fromEntries(new FormData(form).entries());
    localStorage.setItem(`tradebridge-${formName}-last-submit`, JSON.stringify(payload));

    if (status) {
      status.textContent = "Submitted locally for template demo. Connect this form to your CRM or backend API in production.";
    }
  });
});

const calculator = document.getElementById("cost-calculator");
if (calculator) {
  calculator.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(calculator).entries());
    const goods = Number(data.goods) || 0;
    const freight = Number(data.freight) || 0;
    const insurance = Number(data.insurance) || 0;
    const handling = Number(data.handling) || 0;
    const customsValue = goods + freight + insurance;
    const duty = customsValue * ((Number(data.duty) || 0) / 100);
    const tax = (customsValue + duty) * ((Number(data.tax) || 0) / 100);
    const total = customsValue + duty + tax + handling;

    document.getElementById("cost-result").innerHTML = renderCostReport({
      goods,
      freight,
      insurance,
      customsValue,
      duty,
      tax,
      handling,
      total
    });
  });

  calculator.dispatchEvent(new Event("submit", { cancelable: true }));
}

const shipmentForm = document.getElementById("shipment-form");
const saveDraft = document.getElementById("save-draft");
const loadDraft = document.getElementById("load-draft");

if (shipmentForm && saveDraft && loadDraft) {
  saveDraft.addEventListener("click", () => {
    const payload = Object.fromEntries(new FormData(shipmentForm).entries());
    localStorage.setItem("tradebridge-shipment-draft", JSON.stringify(payload));
    shipmentForm.querySelector(".form-status").textContent = "Draft saved in this browser.";
  });

  loadDraft.addEventListener("click", () => {
    const draft = JSON.parse(localStorage.getItem("tradebridge-shipment-draft") || "{}");
    Object.entries(draft).forEach(([key, value]) => {
      const field = shipmentForm.elements[key];
      if (field) field.value = value;
    });
    shipmentForm.querySelector(".form-status").textContent = "Draft loaded.";
  });
}

const documentChecker = document.getElementById("document-checker");
const documentMap = {
  general: ["Commercial invoice", "Packing list", "Bill of lading or airway bill", "Importer/exporter tax ID", "Customs power of attorney"],
  food: ["Commercial invoice", "Packing list", "Health certificate", "Ingredient statement", "Prior notice or food safety registration"],
  electronics: ["Commercial invoice", "Packing list", "Product datasheet", "Safety certificates", "Battery declaration if applicable"],
  textiles: ["Commercial invoice", "Packing list", "Fiber content statement", "Country of origin marking", "Quota or license check if applicable"]
};

if (documentChecker) {
  documentChecker.addEventListener("submit", (event) => {
    event.preventDefault();
    const type = new FormData(documentChecker).get("shipmentType");
    const results = document.getElementById("document-results");
    results.innerHTML = "";
    documentMap[type].forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      results.appendChild(li);
    });
  });
}

const incotermTool = document.getElementById("incoterm-tool");
const incoterms = {
  EXW: "Buyer handles main carriage, export/import clearance, duties, and risk after goods are made available.",
  FOB: "Seller clears export and loads goods on vessel. Buyer handles ocean freight, insurance, import clearance, and delivery.",
  CIF: "Seller pays ocean freight and insurance to destination port. Buyer handles import clearance, duties, and final delivery.",
  DAP: "Seller delivers to named destination. Buyer handles import clearance and duties.",
  DDP: "Seller handles transport, import clearance, duties, and delivery to the buyer location."
};

if (incotermTool) {
  incotermTool.addEventListener("submit", (event) => {
    event.preventDefault();
    const term = new FormData(incotermTool).get("term");
    document.getElementById("incoterm-result").textContent = `${term}: ${incoterms[term]}`;
  });
}

const hsLookup = document.getElementById("hs-lookup");
const hsSamples = [
  { keyword: "coffee", code: "0901", label: "Coffee, roasted or not roasted" },
  { keyword: "laptop", code: "8471", label: "Automatic data processing machines" },
  { keyword: "cotton", code: "5208", label: "Woven fabrics of cotton" },
  { keyword: "furniture", code: "9403", label: "Other furniture and parts" }
];

if (hsLookup) {
  hsLookup.addEventListener("submit", (event) => {
    event.preventDefault();
    const keyword = String(new FormData(hsLookup).get("keyword") || "").toLowerCase();
    const match = hsSamples.find((item) => keyword.includes(item.keyword));
    document.getElementById("hs-result").textContent = match
      ? `${match.code}: ${match.label}\nConfirm final classification with a licensed customs broker.`
      : "No sample match found. Add your commodity database or connect to a classification workflow.";
  });
}

const trackingForm = document.getElementById("tracking-form");
const sampleTracking = {
  "TG-24018": [
    ["Booking Created", "Shipment booked for Shanghai to Savannah."],
    ["Cargo Picked Up", "Supplier pickup completed."],
    ["Export Clearance", "Documents accepted by origin broker."],
    ["In Transit", "Container loaded on vessel."],
    ["Destination ETA", "Estimated arrival in 8 days."]
  ]
};

if (trackingForm) {
  trackingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const reference = String(new FormData(trackingForm).get("reference") || "").trim();
    const milestones = sampleTracking[reference] || [["Reference Not Found", "Connect this tracker to a shipment API or internal database."]];
    const list = document.querySelector("#tracking-results .timeline");
    list.innerHTML = "";
    milestones.forEach(([title, text]) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${title}</strong><span>${text}</span>`;
      list.appendChild(li);
    });
  });
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
  }).format(value);
}

function initThemeSwitcher() {
  const storedTheme = localStorage.getItem("tradebridge-theme");
  const initialTheme = themes.includes(storedTheme) ? storedTheme : "light";
  document.documentElement.dataset.theme = initialTheme;

  if (!nav) return;

  const switcher = document.createElement("div");
  switcher.className = "theme-switcher";
  switcher.setAttribute("aria-label", "Theme options");

  themes.forEach((theme) => {
    const button = document.createElement("button");
    button.className = "theme-option";
    button.type = "button";
    button.textContent = themeLabels[theme];
    button.dataset.themeOption = theme;
    button.setAttribute("aria-pressed", String(theme === initialTheme));
    if (theme === initialTheme) button.classList.add("active");
    switcher.appendChild(button);
  });

  switcher.addEventListener("click", (event) => {
    const button = event.target.closest("[data-theme-option]");
    if (!button) return;
    const theme = button.dataset.themeOption;
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("tradebridge-theme", theme);

    switcher.querySelectorAll(".theme-option").forEach((item) => {
      const active = item.dataset.themeOption === theme;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
  });

  nav.appendChild(switcher);
}

function setCurrentNavLink() {
  if (!navLinks) return;
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  navLinks.querySelectorAll("a").forEach((link) => {
    const linkPage = link.getAttribute("href");
    if (linkPage === currentPage) {
      link.setAttribute("aria-current", "page");
    }
  });
}

function renderCostReport(report) {
  return `
    <div class="calculator-report">
      <div class="report-total">
        <span>Estimated landed cost</span>
        <strong>${formatMoney(report.total)}</strong>
      </div>
      <div class="report-grid">
        ${renderReportItem("Goods value", report.goods)}
        ${renderReportItem("Freight", report.freight)}
        ${renderReportItem("Insurance", report.insurance)}
        ${renderReportItem("Customs value", report.customsValue)}
        ${renderReportItem("Estimated duty", report.duty)}
        ${renderReportItem("Estimated tax", report.tax)}
        ${renderReportItem("Handling", report.handling)}
        ${renderReportItem("Total", report.total)}
      </div>
      <span class="report-note">Planning estimate only. Final landed cost depends on verified HS classification, origin, destination, currency, carrier charges, and customs rulings.</span>
    </div>
  `;
}

function renderReportItem(label, value) {
  return `<div class="report-item"><span>${label}</span><strong>${formatMoney(value)}</strong></div>`;
}

function initTradeMap() {
  const mapElement = document.getElementById("trade-map");
  if (!mapElement || typeof L === "undefined") return;

  const map = L.map(mapElement, {
    scrollWheelZoom: false,
    worldCopyJump: true
  }).setView([24, 20], 2);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 8
  }).addTo(map);

  const ports = [
    { name: "Shanghai", role: "Origin port", coords: [31.2304, 121.4737], type: "origin" },
    { name: "Ho Chi Minh City", role: "Origin region", coords: [10.8231, 106.6297], type: "origin" },
    { name: "Mumbai", role: "Origin port", coords: [19.076, 72.8777], type: "origin" },
    { name: "Savannah", role: "Destination port", coords: [32.0809, -81.0912], type: "destination" },
    { name: "Los Angeles", role: "Destination gateway", coords: [34.0522, -118.2437], type: "destination" },
    { name: "New York", role: "Destination gateway", coords: [40.7128, -74.006], type: "destination" }
  ];

  const routes = [
    ["Shanghai", "Savannah"],
    ["Ho Chi Minh City", "Los Angeles"],
    ["Mumbai", "New York"]
  ];

  ports.forEach((port) => {
    L.marker(port.coords, { icon: createMarkerIcon(port.type) })
      .addTo(map)
      .bindPopup(`<strong>${port.name}</strong>${port.role}`);
  });

  routes.forEach(([originName, destinationName], index) => {
    const origin = ports.find((port) => port.name === originName);
    const destination = ports.find((port) => port.name === destinationName);
    const points = createRoutePoints(origin.coords, destination.coords);

    L.polyline(points, {
      color: index === 0 ? "#c58b2b" : index === 1 ? "#1f5f99" : "#138071",
      dashArray: "8 10",
      opacity: 0.85,
      weight: 3
    }).addTo(map).bindPopup(`<strong>${originName} -> ${destinationName}</strong>Sample trade lane`);
  });
}

function createMarkerIcon(type) {
  return L.divIcon({
    className: "",
    html: `<div class="map-marker ${type === "destination" ? "destination" : ""}"><span></span></div>`,
    iconAnchor: [12, 24],
    iconSize: [24, 24],
    popupAnchor: [0, -22]
  });
}

function createRoutePoints(origin, destination) {
  const points = [];
  const steps = 40;

  for (let index = 0; index <= steps; index += 1) {
    const progress = index / steps;
    const lat = origin[0] + (destination[0] - origin[0]) * progress;
    const lng = origin[1] + (destination[1] - origin[1]) * progress;
    const arc = Math.sin(progress * Math.PI) * 18;
    points.push([lat + arc, lng]);
  }

  return points;
}

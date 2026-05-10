const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

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

    document.getElementById("cost-result").textContent =
      `Customs value: ${formatMoney(customsValue)}\nDuty: ${formatMoney(duty)}\nTax: ${formatMoney(tax)}\nHandling: ${formatMoney(handling)}\nEstimated landed cost: ${formatMoney(total)}`;
  });
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

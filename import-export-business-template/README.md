# Import-Export Business Website Application Template

This is a static, multi-page website application template for an import-export, freight forwarding, customs brokerage, or international trade services company.

## Purpose

The template is designed to help a trade business present services, capture qualified shipment leads, estimate landed costs, guide customers through compliance requirements, and provide a lightweight shipment tracking experience.

## Primary Use Cases

- Generate B2B leads for import/export shipments.
- Collect quote requests with origin, destination, cargo, Incoterms, and service details.
- Educate customers about documentation and customs requirements.
- Provide a practical landed-cost calculator for early budget planning.
- Offer a mock shipment tracking view that can later connect to a logistics API.
- Give sales and operations teams structured intake data through browser-based forms.

## Pages

- `index.html`: Business overview, service highlights, process, and quick intake entry points.
- `services.html`: Detailed service lines for freight, customs, sourcing, warehousing, and trade consulting.
- `quote.html`: Quote request form and landed-cost calculator.
- `shipment.html`: Shipment booking/intake form with local saved draft behavior.
- `compliance.html`: Country/document checklist, Incoterms reference, HS code starter lookup, and risk notes.
- `tracking.html`: Mock tracking utility with milestone timeline and customer support form.

## Included Utilities

- Quote calculator for cargo value, freight, insurance, duty, tax, and handling.
- Shipment request form with validation and local draft saving.
- Compliance checklist by shipment type.
- Incoterms selector with responsibilities summary.
- Sample HS code lookup.
- Mock shipment tracker.

## How To Use

Open `index.html` in a browser. No build tools or server are required.

To deploy with GitHub Pages, push this folder to a repository and configure Pages to serve from the branch root, or move these files to the repository root.

## Integration Notes

The app currently uses browser-only JavaScript and local sample data. In production, replace the local form handlers in `assets/app.js` with API calls to your CRM, freight system, email provider, or backend.

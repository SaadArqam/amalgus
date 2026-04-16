# AmalGus — Smart Product Discovery & Intelligent Matching

## 🚀 Project Overview

AmalGus is a smart B2B/B2C glass marketplace prototype designed to simplify product discovery in a highly fragmented industry.

Instead of navigating complex catalogs, users can describe their requirements in natural language (e.g., *“6mm tempered glass for office partitions”*), and the system intelligently returns the most relevant products with clear explanations.

This project focuses on building a **fast, explainable, and domain-aware matching system** rather than relying solely on black-box AI models.

---

## 🧠 Core Idea

The system bridges the gap between:

* 🗣 **Unstructured user intent** (natural language queries)
* 🧾 **Structured product data** (glass specifications)

It converts vague requirements into actionable product matches using a deterministic, explainable pipeline.

---

## 🛠 Tech Stack

* **Frontend:** React (CDN-based single-page app)
* **Styling:** Tailwind CSS
* **Language:** JavaScript
* **Architecture:** Fully client-side (no backend)

> A lightweight architecture was intentionally chosen to prioritize rapid prototyping and focus on the intelligent matching engine.

---

## 🧠 How Intelligent Matching Works

### 1. Query Understanding (Parsing)

The system extracts structured attributes from natural language:

* Thickness (e.g., 4mm, 6mm, 10mm)
* Category (Tempered, Laminated, Float, IGU, Mirror, Hardware)
* Use-case (partition, balcony, window, office, residential)
* Features (UV protection, safety, energy-efficient, budget)
* Color/tint (clear, bronze, frosted, etc.)

It also handles common synonyms:

* “toughened” → Tempered Glass
* “double glazed” → Insulated Glass Unit
* “cheap” → Budget

---

### 2. Weighted Scoring Engine (0–100)

Each product is evaluated using domain-aware weights:

| Criteria            | Weight |
| ------------------- | ------ |
| Category Match      | 30     |
| Thickness Match     | 25     |
| Use-case Match      | 25     |
| Feature/Color Match | 20     |

Enhancements:

* Strong match boost (category + thickness)
* Partial matching support
* Penalty for weak matches
* Minimum relevance threshold to avoid false results

---

### 3. Intelligent Ranking

* Products are sorted by score (descending)
* Only meaningful matches are returned (score ≥ threshold)
* Budget-aware ranking prioritizes lower-cost options when relevant

---

### 4. Explanation Generation (Explainable AI)

Each result includes a natural-language explanation:

> “Ideal for office partitions with 6mm tempered glass and polished edges.”

Lower-confidence matches include soft hints:

> “May not fully match all requested features.”

This ensures transparency and trust.

---

## 🎯 Key Features

* 🔍 Natural language product search
* 🧠 Intelligent, explainable matching
* 📊 Match score visualization (0–100%)
* 🧩 Category filtering + AI search
* 🛒 Default product catalog (60+ products)
* ⚡ Instant results (no API latency)
* 🛡 Edge-case handling (invalid queries rejected)

---

## 💡 Key Design Decisions

### 1. Deterministic Matching over LLM Dependence

A rule-based, domain-aware system was used to ensure:

* Fast performance
* Full explainability
* Consistent results
* No external API dependency

---

### 2. Single-File React Architecture

* Eliminates setup overhead
* Enables rapid iteration
* Keeps focus on core problem

---

### 3. Scalable Data Design

* Product data separated into a dedicated file
* Expanded dataset (~60 products) to simulate real marketplace behavior

---

## ⚖️ Trade-offs

* No embeddings/vector database due to time constraints
* Matching is heuristic-based (not ML-trained)
* Limited to mock product data

---

## 🔮 Future Improvements

* LLM-assisted explanation refinement
* Vector search for semantic matching at scale
* Image-based product search
* Quantity-based pricing and bulk optimization
* Supplier-side dashboards

---

## 🧪 Example Queries

* “6mm tempered glass for office cabin partitions”
* “laminated safety glass for balcony railing with UV protection”
* “budget 4mm float glass for residential windows”
* “5+12+5 insulated glass for energy-efficient buildings”

---

## ⚙️ How to Run Locally

```bash
git clone <your-repo-link>
cd amal-gus
open index.html
```

No dependencies required — runs directly in browser.

---

## 📌 Demo

Add your deployed link or Loom video here

---

## 👨‍💻 Author

Your Name

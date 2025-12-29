# MedCare 🏥

**MedCare** is a comprehensive smart health management system designed to bridge the gap between patients and their medical data. It features an **AI-powered Prescription Scanner**, medication reminders, doctor discovery, and health analytics.

## 🚀 Key Features

* **📄 AI Prescription Scanner:**
    * Upload images or PDFs of medical reports.
    * **OCR (Tesseract.js)** extracts raw text.
    * **NLP (Med-SpaCy/Python)** analyzes the text to automatically detect Medicines, Dosages, and Vitals (BP, Weight) and saves them to the database.
* **🩺 Doctor Finder:**
    * Search for specialists (Cardiologists, Dentists, etc.) in specific cities.
    * Smart redirection to **Apollo 24/7** or **Google Maps** for real-time booking.
* **⏰ Smart Reminders:**
    * "Center-Screen" alerts for medication time.
    * Browser notifications to keep users updated even when the tab is backgrounded.
* **📊 Health Analytics:**
    * Visual charts to track health trends (Blood Pressure, Weight, Heart Rate) over time.
* **🔐 Secure Dashboard:**
    * User authentication and profile management.
    * Emergency contact management.

---

## 🛠️ Tech Stack

### **Frontend**
* **React.js** - Component-based UI.
* **Context API** - State management.
* **PDF.js** - Handling PDF rendering.
* **Tesseract.js** - Client-side OCR.
* **CSS3** - Custom responsive styling.

### **Backend**
* **Node.js & Express** - RESTful API server.
* **MongoDB & Mongoose** - NoSQL Database for storing user health data.
* **Child Process (`spawn`)** - Bridges Node.js with Python for NLP tasks.

### **AI/ML Microservice**
* **Python 3.11** - Scripting environment.
* **Med-SpaCy** - Clinical Named Entity Recognition (NER).
* **Spacy** - Natural Language Processing.

---

## ⚙️ Architecture

This project uses a unique **Hybrid Architecture** to leverage the best of web and AI technologies:

1.  **Frontend** sends scanned text to the **Node.js Backend**.
2.  **Node.js** spawns a **Python process**.
3.  **Python (Med-SpaCy)** parses the medical text to find clinical entities.
4.  Structured JSON data is returned to Node.js and saved to **MongoDB**.

---

## 💾 Installation & Setup

Follow these steps to run the project locally.

### 1. Clone the Repository
```Bash
git clone https://github.com/Ankita562/MedcareProject.git
cd MedCare
```
### 2. Backend Setup
Navigate to the server folder and install dependencies.

```Bash
cd server
npm install
```
### Set up the Python Environment (For AI Features):

```Bash
# Inside /server folder
py -3.11 -m venv venv
source venv/Scripts/activate  # (Use .\venv\Scripts\activate on Cmd)
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```
### 3. Frontend Setup
Open a new terminal, navigate to the client folder.
```Bash
cd client
npm install
```
### 4. Environment Variables
Create a `.env` file in the `/server` directory:
```env
MONGO_URL=your_mongodb_connection_string
PORT=5000
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```
### 5. Run the App
Start the Backend:

```Bash
# Inside /server (ensure venv is active)
npx nodemon index.js
```
Start the Frontend:
```Bash
# Inside /client
npm start
```
### 📸 Screenshots
(Add screenshots of your Dashboard, Analytics, and Scanning feature here)

### 🤝 Contributing
Fork the repository.
Create a new branch 
```Bash
git checkout -b feature-branch
```
## Commit your changes 
```Bash
git commit -m 'Add new feature'
```
## Push to the branch 
```Bash
git push origin feature-branch
```
## Open a Pull Request.

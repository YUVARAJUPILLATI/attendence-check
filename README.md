# AttendWise – Student Attendance Calculator

> **"Your attendance, under control."**

AttendWise is a modern, responsive, client-side web application designed to help college and university students monitor their attendance, check if they meet the mandatory 75% academic threshold, calculate how many classes they can safely miss, or determine how many consecutive classes they must attend to recover from an attendance shortage.

Built purely using **HTML5**, **CSS3**, and **Vanilla JavaScript** without external runtime dependencies, databases, or paid APIs.

---

## 📸 Key Features

- **Accurate Mathematical Logic**: Direct JavaScript translation of verified attendance formulas.
- **Visual Circular Progress Gauge**: Animated SVG progress ring color-coded green for $\ge 75\%$ and rose/red for $< 75\%$.
- **75% Benchmark Target Indicator**: Linear scale marking the mandatory 75% cutoff threshold.
- **Actionable Student Recommendations**:
  - If $\ge 75\%$: Displays the exact maximum number of additional classes you can safely skip while staying at or above 75%.
  - If $< 75\%$: Displays the minimum number of consecutive classes you must attend in a row to cross 75%.
- **Robust Input Validation**:
  - Accepts only non-negative integers ($\ge 0$).
  - Rejects empty values, negative values, and decimals.
  - Guards against division by zero ($0 \text{ attended} + 0 \text{ absent}$).
- **Modern Student Dashboard UI**: White and light-blue background, navy typography, soft glassmorphism shadows, and smooth micro-interactions.
- **Fully Responsive**: Optimized for smartphones, tablets, laptops, and desktop monitors.
- **Accessible & Keyboard Friendly**: Full tab navigation, `aria-live` error announcements, Enter to calculate, and Escape to reset.

---

## 🧮 Mathematical Logic & Formulas

### 1. Attendance Percentage
$$\text{Total Classes} = \text{Attended} + \text{Absent}$$

$$\text{Percentage} = \left(\frac{\text{Attended}}{\text{Total}}\right) \times 100$$

---

### 2. When Attendance is $\ge 75\%$ (Safe Bunks Formula)
To find how many additional classes $X$ a student can skip without falling below $75\%$ ($3/4$):

$$\frac{\text{Attended}}{\text{Attended} + \text{Absent} + X} \ge \frac{3}{4}$$

Cross-multiplying:
$$4 \times \text{Attended} \ge 3 \times (\text{Attended} + \text{Absent} + X)$$
$$4 \times \text{Attended} \ge 3 \times \text{Attended} + 3 \times \text{Absent} + 3X$$
$$\text{Attended} - 3 \times \text{Absent} \ge 3X$$
$$X \le \frac{\text{Attended}}{3} - \text{Absent}$$

Since $X$ must be a whole number of classes and cannot be negative:
$$\text{Maximum Safe Absences} = \max\left(0, \left\lfloor\frac{\text{Attended}}{3}\right\rfloor - \text{Absent}\right)$$

---

### 3. When Attendance is $< 75\%$ (Recovery Formula)
To find how many consecutive upcoming classes $Y$ the student must attend to reach at least $75\%$ ($3/4$):

$$\frac{\text{Attended} + Y}{\text{Attended} + \text{Absent} + Y} \ge \frac{3}{4}$$

Cross-multiplying:
$$4 \times (\text{Attended} + Y) \ge 3 \times (\text{Attended} + \text{Absent} + Y)$$
$$4 \times \text{Attended} + 4Y \ge 3 \times \text{Attended} + 3 \times \text{Absent} + 3Y$$
$$\text{Attended} + Y \ge 3 \times \text{Absent}$$
$$Y \ge 3 \times \text{Absent} - \text{Attended}$$

Since $Y$ cannot be negative:
$$\text{Consecutive Classes Required} = \max\left(0, 3 \times \text{Absent} - \text{Attended}\right)$$

---

## 📁 Project File Structure

```text
AttendWise/
├── index.html       # Semantic HTML5 layout, accessible form, and results dashboard
├── style.css        # Responsive styling, color variables, animations, and typography
├── script.js        # Form validation, attendance math logic, and SVG meter controller
└── README.md        # Comprehensive documentation and deployment guide
```

---

## 💻 How to Test Locally in VS Code

### Method 1: Using the VS Code "Live Server" Extension (Recommended)
1. Open Visual Studio Code.
2. Click **File** > **Open Folder...** and select this project folder.
3. If not already installed, install the **Live Server** extension by *Ritwick Dey* from the VS Code Extensions tab (`Ctrl + Shift + X`).
4. Right-click on `index.html` in the file explorer and select **Open with Live Server**.
5. Your default web browser will launch `http://127.0.0.1:5500/index.html` with automatic live reloading on file edits.

### Method 2: Direct Browser Launch
1. Open File Explorer in Windows.
2. Navigate to this directory.
3. Double-click `index.html` or drag and drop it into Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari.

### Method 3: Using Python Built-in HTTP Server
In your terminal or PowerShell inside the project directory:
```powershell
python -m http.server 8000
```
Open your browser and navigate to `http://localhost:8000`.

---

## 🚀 Free Deployment Guide

### Option A: Free Deployment via GitHub Pages (Step-by-Step)

GitHub Pages provides 100% free hosting directly from your repository with an automatic SSL certificate (`https://`).

#### Step 1: Initialize Git and Commit Your Files
Open PowerShell or your terminal inside the project directory:
```powershell
git init
git add .
git commit -m "Initial commit of AttendWise Attendance Calculator"
```

#### Step 2: Create a New GitHub Repository
1. Log into your [GitHub Account](https://github.com).
2. In the top right corner, click the **`+`** icon and select **New repository**.
3. Name your repository (e.g., `attendwise` or `attendance-calculator`).
4. Set the visibility to **Public**.
5. Leave "Add a README file" **unchecked** (we already have one).
6. Click **Create repository**.

#### Step 3: Push Your Code to GitHub
Copy the commands shown on GitHub under **"…or push an existing repository from the command line"**:
```powershell
git branch -M main
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
git push -u origin main
```
*(Replace `<YOUR-USERNAME>` and `<YOUR-REPO-NAME>` with your GitHub handle and repo name).*

#### Step 4: Enable GitHub Pages
1. Go to your repository page on GitHub.
2. Click the **Settings** tab (gear icon at the top).
3. In the left sidebar under the "Code and automation" section, click **Pages**.
4. Under **Build and deployment**:
   - **Source**: Select **Deploy from a branch**.
   - **Branch**: Select `main` from the dropdown and set the folder to `/(root)`.
5. Click **Save**.

#### Step 5: Obtain Your Live Website URL
1. Wait approximately 60 to 90 seconds for GitHub's automated action to build the site.
2. Refresh the **Settings > Pages** screen.
3. A notification box will appear at the top saying:
   > *"Your site is live at `https://<YOUR-USERNAME>.github.io/<YOUR-REPO-NAME>/`"*
4. Click **Visit site** to test your live calculator!

#### Step 6: Updating Your Website After Making Changes
Whenever you modify `index.html`, `style.css`, or `script.js`:
```powershell
git add .
git commit -m "Update styling and features"
git push origin main
```
GitHub Pages will automatically rebuild and deploy the new version within 1 minute.

---

### Option B: Free Deployment via Vercel (Alternative)

1. Go to [vercel.com](https://vercel.com) and sign up / log in with your GitHub account.
2. Click **Add New...** > **Project**.
3. Find your `attendwise` repository and click **Import**.
4. Leave all default settings as is (Framework Preset: *Other*, Root Directory: `./`).
5. Click **Deploy**.
6. Within 15 seconds, Vercel will provide you with a production URL (e.g., `https://attendwise.vercel.app`).

---

## 🛡️ Disclaimer

This calculator is provided for estimation purposes and assumes uniform weight for all past and future periods. Academic institutions often impose distinct regulations regarding:
- Laboratory / practical session attendance.
- Medical leave and official on-duty (OD) condonations.
- Minimum cutoff percentages (e.g., 65% with condonation, 85% for specific honors).

Students should always verify their official status on their institution's ERP or student portal.

---

## 📜 License

This project is open source and available under the [MIT License](https://opensource.org/licenses/MIT).

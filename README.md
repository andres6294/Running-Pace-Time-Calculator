# Running-Pace-Time-Calculator
This project is a **web-based running calculator** designed to help runners estimate pace, time, and distance based on any two known values.   It works similarly to professional pace calculators used in major running events.

The tool allows runners to:

- Enter a **distance** (including presets like 5K, 10K, Half Marathon, etc.)
- Enter a **target time** (hours + minutes)
- Enter a **running pace** (minutes + seconds per km)

By providing **at least two** of these fields, the calculator automatically computes the third.

---

## 🚀 Features

### ✔️ Smart distance selector  
Select 5K, 10K, Half Marathon, Marathon, or choose **“Other”** to enter any custom distance manually.

### ✔️ Real-time validation  
Prevents impossible values such as:
- Pace below 0:00  
- Seconds ≥ 60  
- Minutes ≥ 59  

### ✔️ Calculation logic  
The app calculates:
- **Pace** based on distance + time  
- **Total time** based on distance + pace  
- **Distance** based on time + pace  

### ✔️ Auto-disable inputs  
Once two fields are filled, the third input becomes locked to avoid conflicts.

### ✔️ Reset button  
Quickly clear all fields and start over.

### ✔️ Modern, clean UI  
Built with responsive HTML/CSS and designed to be simple and intuitive.

---

## 🧠 Technologies Used

- **HTML5** → Structure and form inputs  
- **CSS3** → Modern styling, layout, and UI improvements  
- **JavaScript (Vanilla)** → Calculation logic, validation, dynamic input handling

No external libraries were required — all logic was implemented manually.

---

## 🖥️ Project Structure

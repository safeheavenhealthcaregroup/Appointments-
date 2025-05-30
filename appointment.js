// Import Firebase and Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDyHY4bRUYd-bB-PD2V-0Yd_DXdZKWuabQ",
  authDomain: "raghuvanshi-healthcare.firebaseapp.com",
  projectId: "raghuvanshi-healthcare",
  storageBucket: "raghuvanshi-healthcare.firebasestorage.app",
  messagingSenderId: "607175735611",
  appId: "1:607175735611:web:2b8431fc8093c691439f1e",
  measurementId: "G-RW66WW5JKC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM Elements
const form = document.getElementById("appointmentForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const dateInput = document.getElementById("date");
const serviceSelect = document.getElementById("service");
const toast = document.querySelector(".toast");

// Utility to show a toast message
function showToast(message, isError = false) {
  toast.textContent = message;
  toast.classList.add(isError ? "toast-error" : "toast-success");
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}

// Validation functions
function validateName() {
  const name = nameInput.value.trim();
  if (name === "") {
    showToast("Name is required.", true);
    return false;
  }
  return true;
}

function validateEmail() {
  const email = emailInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showToast("Invalid email format.", true);
    return false;
  }
  return true;
}

function validatePhone() {
  const phone = phoneInput.value.trim();
  const phoneRegex = /^\d{10}$/; // Only 10 digits
  if (!phoneRegex.test(phone)) {
    showToast("Phone number must be 10 digits.", true);
    return false;
  }
  return true;
}

function validateDate() {
  const date = dateInput.value.trim();
  const dateRegex = /^\d{4}\/\d{2}\/\d{2}$/; // Format YYYY/MM/DD
  const [year, month, day] = date.split("/").map(Number);

  const currentDate = new Date();
  const inputDate = new Date(year, month - 1, day);

  if (!dateRegex.test(date)) {
    showToast("Date must be in YYYY/MM/DD format.", true);
    return false;
  }

  if (inputDate < currentDate) {
    showToast("You cannot select a past date.", true);
    return false;
  }

  const oneMonthFromNow = new Date();
  oneMonthFromNow.setMonth(currentDate.getMonth() + 1);

  if (inputDate > oneMonthFromNow) {
    showToast("Appointments can only be booked within one month.", true);
    return false;
  }

  return true;
}

function validateService() {
  const service = serviceSelect.value;
  if (!service) {
    showToast("Please select a service.", true);
    return false;
  }
  return true;
}

// Add slashes automatically in the date field
dateInput.addEventListener("input", (e) => {
  const value = e.target.value.replace(/[^\d]/g, "").slice(0, 8);
  const parts = [];
  if (value.length >= 4) parts.push(value.slice(0, 4));
  if (value.length >= 6) parts.push(value.slice(4, 6));
  if (value.length > 6) parts.push(value.slice(6));
  e.target.value = parts.join("/");
});

// Handle form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const isValidName = validateName();
  const isValidEmail = validateEmail();
  const isValidPhone = validatePhone();
  const isValidDate = validateDate();
  const isValidService = validateService();

  if (!(isValidName && isValidEmail && isValidPhone && isValidDate && isValidService)) {
    return;
  }

  const formData = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    phone: phoneInput.value.trim(),
    date: dateInput.value.trim(),
    service: serviceSelect.value,
    message: document.getElementById("message").value.trim() || "None",
    timestamp: new Date().toISOString(),
  };

  try {
    const docRef = await addDoc(collection(db, "appointments"), formData);
    showToast("Appointment booked successfully!");
    form.reset();
  } catch (error) {
    console.error("Error adding document: ", error);
    showToast("Failed to book appointment. Please try again.", true);
  }
});

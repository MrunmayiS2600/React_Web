import React, { useState, useEffect } from "react";
import clevertap from "clevertap-web-sdk";
import "./App.css";

const CLEVERTAP_ACCOUNT_ID = 'TEST-6Z8-W9R-R47Z';
const CLEVERTAP_REGION = 'eu1';

// Initialize CleverTap
clevertap.init(CLEVERTAP_ACCOUNT_ID, CLEVERTAP_REGION);

function App() {
  const [formData, setFormData] = useState({
    name: "",
    id: "",
    email: "",
    gender: "",
    phone: "",
    dob: "",
  });
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  useEffect(() => {
    // Check if CleverTap SDK is loaded
    if (window.clevertap) {
      console.log("CleverTap SDK loaded successfully");
    } else {
      console.error("CleverTap SDK is not loaded yet");
      setTimeout(() => {
        if (window.clevertap) {
          console.log("CleverTap SDK loaded successfully after retry");
        } else {
          console.error("CleverTap SDK is still not loaded");
        }
      }, 1000); // Retry after 1 second
    }
    // Register service worker for push notifications
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/clevertap_sw.js")
        .then(function (registration) {
          console.log("Service Worker Registered");
        })
        .catch(function (error) {
          console.error("Service Worker Registration failed:", error);
        });
    }
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (window.clevertap) {
      window.clevertap.onUserLogin.push({
        Site: {
          Name: formData.name,
          Identity: formData.id,
          Email: formData.email,
          Gender: formData.gender,
          Phone: formData.phone,
          DOB: formData.dob,
          "MSG-email": true,
          "MSG-push": true,
          "MSG-sms": true,
          "MSG-whatsapp": true,
        },
      });
      console.log("User data sent to CleverTap:", formData);
      alert("Login data submitted successfully!");
      // Call the showNotificationPrompt after the form submission
      showNotificationPrompt();
    } else {
      console.error("CleverTap SDK is not available");
    }
  };

  // Request notification permission
  const requestNotificationPermission = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted.");
        } else {
          console.log("Notification permission denied.");
        }
      });
    } else {
      console.error("Browser does not support notifications.");
    }
  };

  // Show default notification prompt
  const showNotificationPrompt = () => {
    if (window.clevertap) {
      window.clevertap.notifications.push({
        titleText: "Would you like to receive Push Notifications?",
        bodyText: "We promise to only send you relevant content and updates.",
        okButtonText: "Sign me up!",
        rejectButtonText: "No thanks",
        okButtonColor: "#F28046",
      });
      window.clevertap.event.push("Web Event", { name: formData.name });
      alert("Event pushed");
    } else {
      console.error("CleverTap SDK is not available");
    }
  };

  const showpush = () => {
    clevertap.event.push("Push_Trigger");
  };

  // Handle push notification when button clicked
  const handleClick = () => {
    setIsButtonClicked(true);
    requestNotificationPermission();
    if (window.clevertap) {
      window.clevertap.notifications.push({
        titleText: "Important Announcement!",
        bodyText: "We have an exciting offer for you. Click to find out more!",
        okButtonText: "Check It Out",
        rejectButtonText: "Dismiss",
        okButtonColor: "#007BFF",
        rejectButtonColor: "#E0E0E0",
        onOKClick: function () {
          window.location.href = "/offer"; // Redirect to offer page
        },
        onRejectClick: function () {
          console.log("Notification dismissed");
        },
      });
    } else {
      console.error("CleverTap SDK is not available");
    }
  };

  // Function to show the custom pop-up
  const showCustomPopUp = () => {
    clevertap.event.push("Popup_Trigger");
  };

  const nativeD = () => {
    clevertap.event.push("Native Display");
  };

  return (
    <div className="app-container">
      <div className="form-wrapper">
        <h1>User Registration</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="id">ID:</label>
            <input
              type="text"
              id="id"
              name="id"
              value={formData.id}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="gender">Gender:</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              required
            >
              <option value="">Select</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone:</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="dob">Date of Birth:</label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="submit-btn">Register</button>
        </form>
        
        <div className="button-group">
          <button onClick={handleClick} className="action-btn">Push Notification</button>
          <button onClick={showCustomPopUp} className="action-btn">Show Custom Pop-Up</button>
          <button onClick={showpush} className="action-btn">Send Push</button>
          <button onClick={nativeD} className="action-btn">Native Display</button>
        </div>
        
        {isButtonClicked && <p className="notification-status">Push notification setup initiated!</p>}
      </div>
      <br></br><br></br>
      <div id="nativeD"></div>
    </div>
  
  );
}

export default App;
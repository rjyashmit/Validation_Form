document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("candidateForm");
    const saveButton = document.getElementById("saveButton");
    const notification = document.getElementById("notification");
  
    const nameInput = document.getElementById("fullName");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const phoneToggle = document.getElementById("phoneToggle");
    const passwordInput = document.getElementById("password");
    const languageSelect = document.getElementById("language");
    const aboutInput = document.getElementById("about");
  
    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const phoneError = document.getElementById("phoneError");
    const passwordError = document.getElementById("passwordError");
    const languageError = document.getElementById("languageError");
    const aboutError = document.getElementById("aboutError");
  
    const phoneContainer = document.getElementById("phoneContainer");
  
    function togglePhoneField() {
      if (phoneToggle.checked) {
        phoneContainer.style.display = "block";
      } else {
        phoneContainer.style.display = "none";
        phoneInput.value = "";
        phoneError.textContent = "";
      }
      validateForm();
    }
  
    function validateName() {
      const nameValue = nameInput.value.trim();
      if (nameValue.length < 2) {
        nameError.textContent = "Full name must have at least 2 characters.";
        return false;
      }
      const nameRegex = /^[A-Za-z\s]+$/;
      if (!nameRegex.test(nameValue)) {
        nameError.textContent = "Full name can contain letters and spaces only.";
        return false;
      }
      nameError.textContent = "";
      return true;
    }
  
    function validateEmail() {
      const emailValue = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailValue)) {
        emailError.textContent = "Please enter a valid email address.";
        return false;
      }
      emailError.textContent = "";
      return true;
    }
  
    function validatePhone() {
      if (phoneToggle.checked) {
        const phoneValue = phoneInput.value.trim();
        if (phoneValue !== "") {
          const phoneRegex = /^\d{10}$/;
          if (!phoneRegex.test(phoneValue)) {
            phoneError.textContent = "Phone number must be exactly 10 digits.";
            return false;
          }
        }
      }
      phoneError.textContent = "";
      return true;
    }
  
    function validatePassword() {
      const passwordValue = passwordInput.value;
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%&*!^])[A-Za-z\d@#$%&*!^]{8,}$/;
      if (!passwordRegex.test(passwordValue)) {
        passwordError.textContent =
          "Password must be at least 8 characters and include uppercase, lowercase, digit, and special character.";
        return false;
      }
      passwordError.textContent = "";
      return true;
    }

    function validateLanguage() {
      const langValue = languageSelect.value;
      if (langValue === "") {
        languageError.textContent = "Please select a language.";
        return false;
      }
      languageError.textContent = "";
      return true;
    }
  
    function validateAbout() {
      const aboutValue = aboutInput.value.trim();
      if (aboutValue.length < 50) {
        aboutError.textContent = "About Yourself must be at least 50 characters.";
        return false;
      }
      if (aboutValue.length > 500) {
        aboutError.textContent = "About Yourself cannot exceed 500 characters.";
        return false;
      }
      aboutError.textContent = "";
      return true;
    }
 
    function validateForm() {
      const isNameValid = validateName();
      const isEmailValid = validateEmail();
      const isPhoneValid = validatePhone();
      const isPasswordValid = validatePassword();
      const isLanguageValid = validateLanguage();
      const isAboutValid = validateAbout();
  
      if (isNameValid && isEmailValid && isPhoneValid && isPasswordValid && isLanguageValid && isAboutValid) {
        saveButton.disabled = false;
        return true;
      } else {
        saveButton.disabled = true;
        return false;
      }
    }
  
    nameInput.addEventListener("input", validateForm);
    emailInput.addEventListener("input", validateForm);
    phoneInput.addEventListener("input", validateForm);
    passwordInput.addEventListener("input", validateForm);
    languageSelect.addEventListener("change", validateForm);
    aboutInput.addEventListener("input", validateForm);
    phoneToggle.addEventListener("change", togglePhoneField);
  
    togglePhoneField();

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (validateForm()) {
        const formData = {
          name: nameInput.value.trim(),
          email: emailInput.value.trim(),
          phone: phoneToggle.checked ? phoneInput.value.trim() : "",
          password: passwordInput.value,
          lang: languageSelect.value,
          about: aboutInput.value.trim()
        };
        console.log("Form Data Submitted:", formData);
        fetch("https://admin-staging.whydonate.dev/whydonate/assignment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
          
        })
          .then((response) => {
            console.log(response)
            if (response.status === 200) {
              notification.style.display = "block";
              notification.textContent = "Save successful!";
              // Optionally reset the form after success
              form.reset();
              togglePhoneField();
              saveButton.disabled = true;
              setTimeout(() => {
                notification.style.display = "none";
              }, 3000);
            } else if (response.status === 400) {
              notification.style.display = "block";
              notification.style.backgroundColor = "#f8d7da";
              notification.style.color = "#721c24";
              notification.style.borderColor = "#f5c6cb";
              notification.textContent = "Error saving data! Please check your input.";
              setTimeout(() => {
                notification.style.display = "none";
              }, 3000);
            }
          })
          .catch((error) => {
            console.error("Submission Error:", error);
            notification.style.display = "block";
            notification.style.backgroundColor = "#f8d7da";
            notification.style.color = "#721c24";
            notification.style.borderColor = "#f5c6cb";
            notification.textContent = "Submission failed! Please try again later.";
            setTimeout(() => {
              notification.style.display = "none";
            }, 3000);
          });
      }
    });
  });
  
// Wait for DOM to be fully loaded before accessing elements
document.addEventListener("DOMContentLoaded", () => {
  // Define all DOM elements first
  const dropdowns = document.querySelectorAll(".dropdown-container");
  const inputLanguageDropdown = document.querySelector("#input-language");
  const outputLanguageDropdown = document.querySelector("#output-language");
  const swapBtn = document.querySelector(".swap-position");
  const inputLanguageSelected = inputLanguageDropdown.querySelector(".selected"); // Renamed for clarity
  const outputLanguageSelected = outputLanguageDropdown.querySelector(".selected"); // Renamed for clarity
  const inputTextElem = document.querySelector("#input-text");
  const outputTextElem = document.querySelector("#output-text");
  const uploadDocument = document.querySelector("#upload-document");
  const uploadTitle = document.querySelector("#upload-title");
  const downloadBtn = document.querySelector("#download-btn");
  const darkModeCheckbox = document.getElementById("dark-mode-btn");
  const inputChars = document.querySelector("#input-chars");

  // Set focus on the input text area
  inputTextElem.focus();

  // Populate dropdown function
  function populateDropdown(dropdown, options) {
    const dropdownMenu = dropdown.querySelector("ul");
    dropdownMenu.innerHTML = ""; // Clear existing options
    options.forEach((option) => {
      const li = document.createElement("li");
      const title = `${option.name} (${option.native})`;
      li.innerHTML = title;
      li.dataset.value = option.code;
      li.classList.add("option");
      dropdownMenu.appendChild(li);
    });
  }

  // languages.js is assumed to be loaded before this script
  if (typeof languages !== "undefined") {
    populateDropdown(inputLanguageDropdown, languages);
    populateDropdown(outputLanguageDropdown, languages);
  } else {
    console.error("languages.js not loaded. Dropdowns might not populate.");
  }

  // Setup dropdown event listeners
  dropdowns.forEach((dropdown) => {
    dropdown.addEventListener("click", (e) => {
      // Prevent closing when clicking inside the menu itself (except on options)
      if (!e.target.closest(".option")) {
        dropdown.classList.toggle("active");
      }
    });

    dropdown.querySelectorAll(".option").forEach((item) => {
      item.addEventListener("click", (e) => {
        // Remove active class from all options in the current dropdown
        dropdown.querySelectorAll(".option").forEach((el) => {
          el.classList.remove("active");
        });
        item.classList.add("active"); // Add active class to clicked option

        const selected = dropdown.querySelector(".selected");
        selected.innerHTML = item.innerHTML;
        selected.dataset.value = item.dataset.value;
        dropdown.classList.remove("active"); // Close dropdown after selection
        translate();
      });
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener("click", (e) => {
    dropdowns.forEach((dropdown) => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove("active");
      }
    });
  });

  // Debounce function to limit API calls
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }

  // Translation function
  async function translate() {
    const inputText = inputTextElem.value.trim();
    if (!inputText) {
      outputTextElem.value = "";
      return;
    }

    const inputLangCode = inputLanguageSelected.dataset.value;
    const outputLangCode = outputLanguageSelected.dataset.value;

    // Don't translate if languages are the same (except for auto-detect)
    if (inputLangCode === outputLangCode && inputLangCode !== "auto") {
      outputTextElem.value = inputText;
      return;
    }

    // Visual indicator that translation is happening
    outputTextElem.value = "Translating...";

    // Construct URL for Google Translate API (public, rate-limited, for demo purposes)
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${inputLangCode}&tl=${outputLangCode}&dt=t&q=${encodeURIComponent(inputText)}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const json = await response.json();

      if (json && json[0]) {
        // Concatenate all translated segments
        const translatedText = json[0].map((item) => item[0]).join("");
        outputTextElem.value = translatedText;
      } else {
        outputTextElem.value = "Translation error: Unexpected API response.";
      }
    } catch (error) {
      console.error("Translation failed:", error);
      outputTextElem.value = "Translation failed. Please try again later.";
    }
  }

  // Swap button functionality
  swapBtn.addEventListener("click", () => {
    // Disable swap button if input language is Auto
    if (inputLanguageSelected.dataset.value === "auto") {
      swapBtn.classList.add("swap-disabled");
      setTimeout(() => {
        swapBtn.classList.remove("swap-disabled");
      }, 500); // Duration of shake animation
      return;
    }

    // Add animation class
    swapBtn.classList.add("swap-animation");
    // Remove animation class after it completes
    swapBtn.addEventListener('animationend', () => {
      swapBtn.classList.remove("swap-animation");
    }, { once: true });


    // Swap selected language displays
    const tempLangText = inputLanguageSelected.innerHTML;
    inputLanguageSelected.innerHTML = outputLanguageSelected.innerHTML;
    outputLanguageSelected.innerHTML = tempLangText;

    // Swap language data values
    const tempLangValue = inputLanguageSelected.dataset.value;
    inputLanguageSelected.dataset.value = outputLanguageSelected.dataset.value;
    outputLanguageSelected.dataset.value = tempLangValue;

    // Swap actual text content
    const tempInputText = inputTextElem.value;
    inputTextElem.value = outputTextElem.value;
    outputTextElem.value = tempInputText;

    // Update character count for the (new) input text
    inputChars.innerHTML = inputTextElem.value.length;

    // Re-run translation after swap
    translate();
  });

  // Input text event listener with debounce
  inputTextElem.addEventListener("input", debounce(() => {
    // Update character count
    inputChars.innerHTML = inputTextElem.value.length;

    // Limit input to 5000 characters (if user types more quickly than debounce)
    if (inputTextElem.value.length > 5000) {
      inputTextElem.value = inputTextElem.value.slice(0, 5000);
      inputChars.innerHTML = "5000"; // Ensure count is correct after truncation
    }

    // Trigger translation if there's content
    if (inputTextElem.value.trim().length > 0) {
      translate();
    } else {
      outputTextElem.value = ""; // Clear output if input is empty
    }
  }, 500)); // 500ms delay before translation happens

  // File upload handling
  uploadDocument.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) {
      uploadTitle.innerHTML = "Upload Document"; // Reset text if no file selected
      return;
    }

    uploadTitle.innerHTML = file.name.length > 20 ? file.name.substring(0, 17) + "..." : file.name; // Truncate long file names

    if (file.type === "text/plain") {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (event) => {
        const content = event.target.result;
        // Limit to 5000 chars
        inputTextElem.value = content.length > 5000 ? content.slice(0, 5000) : content;
        inputChars.innerHTML = inputTextElem.value.length;
        translate();
      };
      reader.onerror = () => {
        alert("Failed to read file.");
        uploadTitle.innerHTML = "Upload Document";
      };
    } else if (
      file.type === "application/pdf" ||
      file.type === "application/msword" ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      // For PDF/DOCX, actual text extraction is complex on frontend.
      // This is a placeholder for a more robust backend solution.
      alert(
        "For PDF/DOCX files, only plain text content can be processed by this tool. Consider copying and pasting the text directly for best results."
      );
      inputTextElem.value = `Note: Advanced document parsing for "${file.name}" is not fully supported in this demo. Please copy and paste text manually for translation.`;
      inputChars.innerHTML = inputTextElem.value.length;
      outputTextElem.value = ""; // Clear output until user provides text
    } else {
      alert("Please upload a valid text file (TXT, PDF, DOC, or DOCX).");
      uploadTitle.innerHTML = "Upload Document";
      inputTextElem.value = ""; // Clear input for invalid file types
      inputChars.innerHTML = "0";
    }
    // Clear the input to allow selecting the same file again if needed
    e.target.value = '';
  });

  // Download functionality
  downloadBtn.addEventListener("click", () => {
    const outputText = outputTextElem.value.trim();
    if (!outputText) {
      alert("There is no translated text to download.");
      return;
    }

    const outputLanguage = outputLanguageSelected.dataset.value;
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `translated-to-${outputLanguage}-${timestamp}.txt`;

    const blob = new Blob([outputText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = filename;
    a.href = url;
    document.body.appendChild(a); // Append to body to ensure it's in DOM
    a.click();
    document.body.removeChild(a); // Clean up
    URL.revokeObjectURL(url); // Release object URL
  });

  // Dark mode toggle
  darkModeCheckbox.addEventListener("change", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("darkMode", darkModeCheckbox.checked); // Save preference
  });

  // Load dark mode preference on page load
  const savedDarkMode = localStorage.getItem("darkMode");
  if (savedDarkMode === "true") {
    darkModeCheckbox.checked = true;
    document.body.classList.add("dark");
  }

  // Set default input language (Auto Detect) and output language (English)
  function setDefaultLanguages() {
    // Input Language: Auto Detect
    let defaultInputOption = inputLanguageDropdown.querySelector('[data-value="auto"]');
    if (defaultInputOption) {
      inputLanguageSelected.innerHTML = defaultInputOption.innerHTML;
      inputLanguageSelected.dataset.value = defaultInputOption.dataset.value;
      // Also ensure the "Auto Detect" option itself has the active class if it's rendered
      // (though usually only one is active at a time for selection purposes)
    }

    // Output Language: English
    let defaultOutputOption = outputLanguageDropdown.querySelector('[data-value="en"]');
    if (defaultOutputOption) {
      outputLanguageSelected.innerHTML = defaultOutputOption.innerHTML;
      outputLanguageSelected.dataset.value = defaultOutputOption.dataset.value;
      // Add active class to English in the output menu
      outputLanguageDropdown.querySelectorAll(".option").forEach(item => {
        if (item.dataset.value === "en") {
          item.classList.add("active");
        } else {
          item.classList.remove("active");
        }
      });
    }
  }
  setDefaultLanguages();


  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    // Ctrl+Enter to translate (if input is focused)
    if (e.ctrlKey && e.key === "Enter" && inputTextElem === document.activeElement) {
      e.preventDefault(); // Prevent new line in textarea
      translate();
    }

    // Ctrl+S to download
    if (e.ctrlKey && e.key === "s") {
      e.preventDefault(); // Prevent browser save dialog
      downloadBtn.click();
    }

    // Ctrl+Shift+S to swap languages
    if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === "S") { // Using key.toUpperCase() for consistency
      e.preventDefault(); // Prevent any default browser action
      swapBtn.click();
    }
  });

  // Initial character count update
  inputChars.innerHTML = inputTextElem.value.length;
});
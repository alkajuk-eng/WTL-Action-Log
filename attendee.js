// LocalStorage
const savedData = JSON.parse(
  localStorage.getItem("formData") || "null"
);

// Select container
const namesContainer =
  document.querySelector(".namesContainer");

// Selected names
let checkedNames = savedData?.attendees || [];

// Create employee list
if (savedData?.names) {

  // Remove names that are no longer available
  checkedNames = checkedNames.filter(
    name => savedData.names.includes(name)
  );

  savedData.names.forEach((name, index) => {

    const div =
      document.createElement("div");

    const checkbox =
      document.createElement("input");

    checkbox.type = "checkbox";
    checkbox.value = name;
    checkbox.id = `employee-${index}`;

    // Restore checked state
    checkbox.checked =
      checkedNames.includes(name);

    const label =
      document.createElement("label");

    label.htmlFor =
      `employee-${index}`;

    label.textContent =
      name;

    div.appendChild(
      checkbox
    );

    div.appendChild(
      label
    );

    namesContainer.appendChild(
      div
    );
  });

  // Save attendees inside formData
  saveFormData();
}

// Checkbox change
document
  .querySelectorAll(
    'input[type="checkbox"]'
  )
  .forEach(checkbox => {

    checkbox.addEventListener(
      "change",
      () => {

        checkedNames = [
          ...document.querySelectorAll(
            'input[type="checkbox"]:checked'
          )
        ].map(
          checkbox =>
            checkbox.value
        );

        saveFormData();

        console.log(
          "Attendees:",
          checkedNames
        );
      }
    );
  });

// Save formData
function saveFormData() {

  const formData =
    JSON.parse(
      localStorage.getItem(
        "formData"
      ) || "{}"
    );

  formData.attendees =
    checkedNames;

  localStorage.setItem(
    "formData",
    JSON.stringify(
      formData
    )
  );
}
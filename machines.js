// LocalStorage
const savedData = JSON.parse(
  localStorage.getItem("formData") || "null"
);

// Select container
const machineContainer =
  document.querySelector(".container");

// Constants
const machines =
  savedData?.machines || [];

const checkedNames =
  savedData?.attendees || [];

const MAX_PHOTOS = 10;

// Variables
let rowIndex = 0;

let machineRows =
  savedData?.machineRows || [];

// =========================
// RESIZE PHOTO
// =========================

function resizePhoto(file) {

  return new Promise(resolve => {

    const reader =
      new FileReader();

    reader.onload = event => {

      const image =
        new Image();

      image.onload = () => {

        const maxWidth = 1200;
        const maxHeight = 1200;

        let width =
          image.width;

        let height =
          image.height;

        if (
          width > maxWidth ||
          height > maxHeight
        ) {

          const ratio =
            Math.min(
              maxWidth / width,
              maxHeight / height
            );

          width =
            Math.round(
              width * ratio
            );

          height =
            Math.round(
              height * ratio
            );
        }

        const canvas =
          document.createElement(
            "canvas"
          );

        canvas.width =
          width;

        canvas.height =
          height;

        const context =
          canvas.getContext(
            "2d"
          );

        context.drawImage(
          image,
          0,
          0,
          width,
          height
        );

        resolve(
          canvas.toDataURL(
            "image/jpeg",
            0.7
          )
        );
      };

      image.src =
        event.target.result;
    };

    reader.readAsDataURL(
      file
    );
  });
}

// =========================
// GET TOTAL PHOTOS
// =========================

function getTotalPhotos() {

  let total = 0;

  machineRows.forEach(row => {

    if (
      row.safetyObservation?.photo
    ) {
      total++;
    }

    if (
      row.fiveSObservation?.photo
    ) {
      total++;
    }

    if (
      row.operatorReview?.photo
    ) {
      total++;
    }
  });

  return total;
}

// =========================
// OBSERVATION GROUP
// =========================

function createObservationGroup(
  title,
  id,
  savedData = null
) {

  const group =
    document.createElement(
      "div"
    );

  group.classList.add(
    "group"
  );

  // Label

  const label =
    document.createElement(
      "label"
    );

  label.textContent =
    title;

  label.htmlFor =
    id;

  // Select

  const select =
    document.createElement(
      "select"
    );

  select.id =
    id;

  select.classList.add(
    "observation"
  );

  // Placeholder

  const placeholder =
    document.createElement(
      "option"
    );

  placeholder.value =
    "";

  placeholder.textContent =
    "Select";

  placeholder.disabled =
    true;

  placeholder.selected =
    true;

  select.appendChild(
    placeholder
  );

  // Options

  ["Good", "Not Good"].forEach(
    item => {

      const option =
        document.createElement(
          "option"
        );

      option.value =
        item;

      option.textContent =
        item;

      select.appendChild(
        option
      );
    }
  );

  // =========================
  // DETAILS
  // =========================

  const details =
    document.createElement(
      "div"
    );

  details.classList.add(
    "observation-details"
  );

  details.style.display =
    "none";

  // =========================
  // COMMENTS
  // =========================

  const commentsLabel =
    document.createElement(
      "label"
    );

  commentsLabel.textContent =
    "Comments";

  const comments =
    document.createElement(
      "input"
    );

  comments.type =
    "text";

  comments.classList.add(
    "observation-comments-input"
  );

  comments.placeholder =
    "Enter comments";

  // =========================
  // PHOTO
  // =========================

  const photoLabel =
    document.createElement(
      "label"
    );

  photoLabel.textContent =
    "Photo";

  const photo =
    document.createElement(
      "input"
    );

  photo.type =
    "file";

  photo.accept =
    "image/*";

  const preview =
    document.createElement(
      "img"
    );

  preview.classList.add(
    "photo-preview"
  );

  preview.style.display =
    "none";

  // Add details

  details.appendChild(
    commentsLabel
  );

  details.appendChild(
    comments
  );

  details.appendChild(
    photoLabel
  );

  details.appendChild(
    photo
  );

  details.appendChild(
    preview
  );

  // Add group

  group.appendChild(
    label
  );

  group.appendChild(
    select
  );

  group.appendChild(
    details
  );

  // =========================
  // RESTORE SAVED DATA
  // =========================

  if (savedData) {

    select.value =
      savedData.result || "";

    comments.value =
      savedData.comments || "";

    if (savedData.photo) {

      preview.src =
        savedData.photo;

      preview.style.display =
        "block";
    }

    if (
      savedData.result ===
      "Not Good"
    ) {

      details.style.display =
        "block";
    }
  }

  // =========================
  // SELECT CHANGE
  // =========================

  select.addEventListener(
    "change",
    () => {

      if (
        select.value ===
        "Not Good"
      ) {

        details.style.display =
          "block";

      } else {

        details.style.display =
          "none";

        comments.value =
          "";

        photo.value =
          "";

        preview.src =
          "";

        preview.style.display =
          "none";
      }

      saveCurrentRows();

      checkLastRow();
    }
  );

  // =========================
  // COMMENTS CHANGE
  // =========================

  comments.addEventListener(
    "input",
    () => {

      saveCurrentRows();
    }
  );

  // =========================
  // PHOTO CHANGE
  // =========================

  photo.addEventListener(
    "change",
    async () => {

      if (!photo.files[0]) {
        return;
      }

      if (
        getTotalPhotos() >=
        MAX_PHOTOS
      ) {

        alert(
          "Maximum 10 photos allowed."
        );

        photo.value =
          "";

        return;
      }

      const image =
        await resizePhoto(
          photo.files[0]
        );

      preview.src =
        image;

      preview.style.display =
        "block";

      saveCurrentRows();
    }
  );

  return {
    group,
    select,
    comments,
    photo,
    preview
  };
}

// =========================
// CREATE MACHINE ROW
// =========================

function createMachineRow(
  savedRow = null
) {

  // =========================
  // USED MACHINES
  // =========================

  const usedMachines =
    [
      ...document.querySelectorAll(
        ".machine"
      )
    ]
      .map(
        select =>
          select.value
      )
      .filter(
        value =>
          value !== ""
      );

  // =========================
  // USED NAMES
  // =========================

  const usedNames =
    [
      ...document.querySelectorAll(
        ".name"
      )
    ]
      .map(
        select =>
          select.value
      )
      .filter(
        value =>
          value !== ""
      );

  // =========================
  // AVAILABLE MACHINES
  // =========================

  const availableMachines =
    machines.filter(
      machine =>
        machine ===
          savedRow?.machine ||
        !usedMachines.includes(
          machine
        )
    );

  // =========================
  // AVAILABLE NAMES
  // =========================

  const availableNames =
    checkedNames.filter(
      name =>
        name ===
          savedRow?.name ||
        !usedNames.includes(
          name
        )
    );

  if (
    availableMachines.length === 0 ||
    availableNames.length === 0
  ) {
    return;
  }

  // =========================
  // ROW
  // =========================

  const row =
    document.createElement(
      "div"
    );

  row.classList.add(
    "machine-row"
  );

  // =========================
  // MACHINE
  // =========================

  const machineGroup =
    document.createElement(
      "div"
    );

  machineGroup.classList.add(
    "group"
  );

  const machineId =
    `machine-${rowIndex}`;

  const machineLabel =
    document.createElement(
      "label"
    );

  machineLabel.textContent =
    "Machine";

  machineLabel.htmlFor =
    machineId;

  const machineSelect =
    document.createElement(
      "select"
    );

  machineSelect.id =
    machineId;

  machineSelect.classList.add(
    "machine"
  );

  const machinePlaceholder =
    document.createElement(
      "option"
    );

  machinePlaceholder.value =
    "";

  machinePlaceholder.textContent =
    "Select Machine";

  machinePlaceholder.disabled =
    true;

  machinePlaceholder.selected =
    true;

  machineSelect.appendChild(
    machinePlaceholder
  );

  availableMachines.forEach(
    machine => {

      const option =
        document.createElement(
          "option"
        );

      option.value =
        machine;

      option.textContent =
        machine;

      machineSelect.appendChild(
        option
      );
    }
  );

  machineGroup.appendChild(
    machineLabel
  );

  machineGroup.appendChild(
    machineSelect
  );

  // =========================
  // NAME
  // =========================

  const nameGroup =
    document.createElement(
      "div"
    );

  nameGroup.classList.add(
    "group"
  );

  const nameId =
    `name-${rowIndex}`;

  const nameLabel =
    document.createElement(
      "label"
    );

  nameLabel.textContent =
    "Name";

  nameLabel.htmlFor =
    nameId;

  const nameSelect =
    document.createElement(
      "select"
    );

  nameSelect.id =
    nameId;

  nameSelect.classList.add(
    "name"
  );

  const namePlaceholder =
    document.createElement(
      "option"
    );

  namePlaceholder.value =
    "";

  namePlaceholder.textContent =
    "Select Name";

  namePlaceholder.disabled =
    true;

  namePlaceholder.selected =
    true;

  nameSelect.appendChild(
    namePlaceholder
  );

  availableNames.forEach(
    name => {

      const option =
        document.createElement(
          "option"
        );

      option.value =
        name;

      option.textContent =
        name;

      nameSelect.appendChild(
        option
      );
    }
  );

  nameGroup.appendChild(
    nameLabel
  );

  nameGroup.appendChild(
    nameSelect
  );

  // =========================
  // SAFETY CHECK
  // =========================

  const safetyGroup =
    document.createElement(
      "div"
    );

  safetyGroup.classList.add(
    "group"
  );

  const safetyId =
    `safety-${rowIndex}`;

  const safetyLabel =
    document.createElement(
      "label"
    );

  safetyLabel.textContent =
    "Safety Check";

  safetyLabel.htmlFor =
    safetyId;

  const safetySelect =
    document.createElement(
      "select"
    );

  safetySelect.id =
    safetyId;

  safetySelect.classList.add(
    "safety"
  );

  const safetyPlaceholder =
    document.createElement(
      "option"
    );

  safetyPlaceholder.value =
    "";

  safetyPlaceholder.textContent =
    "Select";

  safetyPlaceholder.disabled =
    true;

  safetyPlaceholder.selected =
    true;

  safetySelect.appendChild(
    safetyPlaceholder
  );

  ["OK", "Not OK"].forEach(
    item => {

      const option =
        document.createElement(
          "option"
        );

      option.value =
        item;

      option.textContent =
        item;

      safetySelect.appendChild(
        option
      );
    }
  );

  safetyGroup.appendChild(
    safetyLabel
  );

  safetyGroup.appendChild(
    safetySelect
  );

  // =========================
  // PROCESS CHECK
  // =========================

  const processGroup =
    document.createElement(
      "div"
    );

  processGroup.classList.add(
    "group"
  );

  const processId =
    `process-${rowIndex}`;

  const processLabel =
    document.createElement(
      "label"
    );

  processLabel.textContent =
    "Process Check";

  processLabel.htmlFor =
    processId;

  const processSelect =
    document.createElement(
      "select"
    );

  processSelect.id =
    processId;

  processSelect.classList.add(
    "process"
  );

  const processPlaceholder =
    document.createElement(
      "option"
    );

  processPlaceholder.value =
    "";

  processPlaceholder.textContent =
    "Select";

  processPlaceholder.disabled =
    true;

  processPlaceholder.selected =
    true;

  processSelect.appendChild(
    processPlaceholder
  );

  ["Yes", "No"].forEach(
    item => {

      const option =
        document.createElement(
          "option"
        );

      option.value =
        item;

      option.textContent =
        item;

      processSelect.appendChild(
        option
      );
    }
  );

  processGroup.appendChild(
    processLabel
  );

  processGroup.appendChild(
    processSelect
  );

  // =========================
  // MATERIAL CHECK
  // =========================

  const materialGroup =
    document.createElement(
      "div"
    );

  materialGroup.classList.add(
    "group"
  );

  const materialId =
    `material-${rowIndex}`;

  const materialLabel =
    document.createElement(
      "label"
    );

  materialLabel.textContent =
    "Material Check";

  materialLabel.htmlFor =
    materialId;

  const materialSelect =
    document.createElement(
      "select"
    );

  materialSelect.id =
    materialId;

  materialSelect.classList.add(
    "material"
  );

  const materialPlaceholder =
    document.createElement(
      "option"
    );

  materialPlaceholder.value =
    "";

  materialPlaceholder.textContent =
    "Select";

  materialPlaceholder.disabled =
    true;

  materialPlaceholder.selected =
    true;

  materialSelect.appendChild(
    materialPlaceholder
  );

  [
    "Yes",
    "No",
    "Incomplete"
  ].forEach(
    item => {

      const option =
        document.createElement(
          "option"
        );

      option.value =
        item;

      option.textContent =
        item;

      materialSelect.appendChild(
        option
      );
    }
  );

  materialGroup.appendChild(
    materialLabel
  );

  materialGroup.appendChild(
    materialSelect
  );

  // =========================
  // MATERIAL COMMENTS
  // =========================

  const materialComments =
    document.createElement(
      "div"
    );

  materialComments.classList.add(
    "material-comments"
  );

  materialComments.style.display =
    "none";

  const materialCommentsLabel =
    document.createElement(
      "label"
    );

  materialCommentsLabel.textContent =
    "Comments";

  const materialCommentsInput =
    document.createElement(
      "input"
    );

  materialCommentsInput.type =
    "text";

  materialCommentsInput.classList.add(
    "material-comments-input"
  );

  materialCommentsInput.placeholder =
    "Enter comments";

  materialComments.appendChild(
    materialCommentsLabel
  );

  materialComments.appendChild(
    materialCommentsInput
  );

  materialGroup.appendChild(
    materialComments
  );

  // =========================
  // OBSERVATIONS
  // =========================

  const safetyObservation =
    createObservationGroup(
      "Safety Observation",
      `safety-observation-${rowIndex}`,
      savedRow?.safetyObservation
    );

  const fiveSObservation =
    createObservationGroup(
      "5'S Observation",
      `five-s-observation-${rowIndex}`,
      savedRow?.fiveSObservation
    );

  const operatorReview =
    createObservationGroup(
      "Operator Review",
      `operator-review-${rowIndex}`,
      savedRow?.operatorReview
    );

  // =========================
  // ADD GROUPS TO ROW
  // =========================

  row.appendChild(
    machineGroup
  );

  row.appendChild(
    nameGroup
  );

  row.appendChild(
    safetyGroup
  );

  row.appendChild(
    processGroup
  );

  row.appendChild(
    materialGroup
  );

  row.appendChild(
    safetyObservation.group
  );

  row.appendChild(
    fiveSObservation.group
  );

  row.appendChild(
    operatorReview.group
  );

  machineContainer.appendChild(
    row
  );

  // =========================
  // RESTORE SAVED ROW
  // =========================

  if (savedRow) {

    machineSelect.value =
      savedRow.machine || "";

    nameSelect.value =
      savedRow.name || "";

    safetySelect.value =
      savedRow.safetyCheck || "";

    processSelect.value =
      savedRow.processCheck || "";

    materialSelect.value =
      savedRow.materialCheck || "";

    materialCommentsInput.value =
      savedRow.materialComments || "";

    if (
      savedRow.materialCheck ===
        "No" ||
      savedRow.materialCheck ===
        "Incomplete"
    ) {

      materialComments.style.display =
        "block";
    }
  }

  rowIndex++;

  // =========================
  // MACHINE CHANGE
  // =========================

  machineSelect.addEventListener(
    "change",
    () => {

      updateMachineSelects();

      saveCurrentRows();

      checkLastRow();
    }
  );

  // =========================
  // NAME CHANGE
  // =========================

  nameSelect.addEventListener(
    "change",
    () => {

      updateNameSelects();

      saveCurrentRows();

      checkLastRow();
    }
  );

  // =========================
  // SAFETY CHANGE
  // =========================

  safetySelect.addEventListener(
    "change",
    () => {

      saveCurrentRows();

      checkLastRow();
    }
  );

  // =========================
  // PROCESS CHANGE
  // =========================

  processSelect.addEventListener(
    "change",
    () => {

      saveCurrentRows();

      checkLastRow();
    }
  );

  // =========================
  // MATERIAL CHANGE
  // =========================

  materialSelect.addEventListener(
    "change",
    () => {

      if (
        materialSelect.value ===
          "No" ||
        materialSelect.value ===
          "Incomplete"
      ) {

        materialComments.style.display =
          "block";

      } else {

        materialComments.style.display =
          "none";

        materialCommentsInput.value =
          "";
      }

      saveCurrentRows();

      checkLastRow();
    }
  );

  // =========================
  // MATERIAL COMMENTS
  // =========================

  materialCommentsInput.addEventListener(
    "input",
    () => {

      saveCurrentRows();
    }
  );

  return row;
}

// =========================
// GET ROW DATA
// =========================

function getRowData(row) {

  const observations =
    row.querySelectorAll(
      ".observation"
    );

  const comments =
    row.querySelectorAll(
      ".observation-comments-input"
    );

  const previews =
    row.querySelectorAll(
      ".photo-preview"
    );

  return {

    machine:
      row.querySelector(
        ".machine"
      )?.value || "",

    name:
      row.querySelector(
        ".name"
      )?.value || "",

    safetyCheck:
      row.querySelector(
        ".safety"
      )?.value || "",

    processCheck:
      row.querySelector(
        ".process"
      )?.value || "",

    materialCheck:
      row.querySelector(
        ".material"
      )?.value || "",

    materialComments:
      row.querySelector(
        ".material-comments-input"
      )?.value || "",

    safetyObservation: {
      result:
        observations[0]?.value || "",

      comments:
        comments[0]?.value || "",

      photo:
        previews[0]?.src || ""
    },

    fiveSObservation: {
      result:
        observations[1]?.value || "",

      comments:
        comments[1]?.value || "",

      photo:
        previews[1]?.src || ""
    },

    operatorReview: {
      result:
        observations[2]?.value || "",

      comments:
        comments[2]?.value || "",

      photo:
        previews[2]?.src || ""
    }
  };
}

// =========================
// SAVE CURRENT ROWS
// =========================

function saveCurrentRows() {

  const rows =
    [
      ...document.querySelectorAll(
        ".machine-row"
      )
    ];

  machineRows =
    rows
      .map(
        row =>
          getRowData(row)
      )
      .filter(
        row =>
          row.machine ||
          row.name ||
          row.safetyCheck ||
          row.processCheck ||
          row.materialCheck ||
          row.safetyObservation.result ||
          row.fiveSObservation.result ||
          row.operatorReview.result
      );

  saveFormData();
}

// =========================
// SAVE FORM DATA
// =========================

function saveFormData() {

  const formData =
    JSON.parse(
      localStorage.getItem(
        "formData"
      ) || "{}"
    );

  formData.machineRows =
    machineRows;

  localStorage.setItem(
    "formData",
    JSON.stringify(
      formData
    )
  );
}

// =========================
// UPDATE MACHINE SELECTS
// =========================

function updateMachineSelects() {

  const selects =
    [
      ...document.querySelectorAll(
        ".machine"
      )
    ];

  const values =
    selects.map(
      select =>
        select.value
    );

  selects.forEach(
    (select, index) => {

      const currentValue =
        values[index];

      const used =
        values.filter(
          (value, valueIndex) =>
            value &&
            valueIndex !== index
        );

      select.innerHTML =
        "";

      const placeholder =
        document.createElement(
          "option"
        );

      placeholder.value =
        "";

      placeholder.textContent =
        "Select Machine";

      placeholder.disabled =
        true;

      select.appendChild(
        placeholder
      );

      machines.forEach(
        machine => {

          if (
            machine ===
              currentValue ||
            !used.includes(
              machine
            )
          ) {

            const option =
              document.createElement(
                "option"
              );

            option.value =
              machine;

            option.textContent =
              machine;

            select.appendChild(
              option
            );
          }
        }
      );

      select.value =
        currentValue;
    }
  );
}

// =========================
// UPDATE NAME SELECTS
// =========================

function updateNameSelects() {

  const selects =
    [
      ...document.querySelectorAll(
        ".name"
      )
    ];

  const values =
    selects.map(
      select =>
        select.value
    );

  selects.forEach(
    (select, index) => {

      const currentValue =
        values[index];

      const used =
        values.filter(
          (value, valueIndex) =>
            value &&
            valueIndex !== index
        );

      select.innerHTML =
        "";

      const placeholder =
        document.createElement(
          "option"
        );

      placeholder.value =
        "";

      placeholder.textContent =
        "Select Name";

      placeholder.disabled =
        true;

      select.appendChild(
        placeholder
      );

      checkedNames.forEach(
        name => {

          if (
            name ===
              currentValue ||
            !used.includes(
              name
            )
          ) {

            const option =
              document.createElement(
                "option"
              );

            option.value =
              name;

            option.textContent =
              name;

            select.appendChild(
              option
            );
          }
        }
      );

      select.value =
        currentValue;
    }
  );
}

// =========================
// CHECK LAST ROW
// =========================

function checkLastRow() {

  const rows =
    document.querySelectorAll(
      ".machine-row"
    );

  const lastRow =
    rows[rows.length - 1];

  if (!lastRow) {
    return;
  }

  const machine =
    lastRow.querySelector(
      ".machine"
    )?.value;

  const name =
    lastRow.querySelector(
      ".name"
    )?.value;

  const safety =
    lastRow.querySelector(
      ".safety"
    )?.value;

  const process =
    lastRow.querySelector(
      ".process"
    )?.value;

  const material =
    lastRow.querySelector(
      ".material"
    )?.value;

  const observations =
    [
      ...lastRow.querySelectorAll(
        ".observation"
      )
    ];

  const allSelected =
    machine &&
    name &&
    safety &&
    process &&
    material &&
    observations.length === 3 &&
    observations.every(
      select =>
        select.value
    );

  if (
    allSelected &&
    lastRow.dataset.completed !==
      "true"
  ) {

    lastRow.dataset.completed =
      "true";

    saveCurrentRows();

    createMachineRow();
  }
}

// =========================
// SAVE BEFORE NAVIGATION
// =========================

document
  .querySelectorAll(
    "a"
  )
  .forEach(
    link => {

      link.addEventListener(
        "click",
        () => {

          saveCurrentRows();
        }
      );
    }
  );

// =========================
// RESTORE SAVED ROWS
// =========================

if (
  machineRows.length > 0
) {

  machineRows.forEach(
    savedRow => {

      createMachineRow(
        savedRow
      );
    }
  );

} else {

  // Create one empty row
  createMachineRow();
}
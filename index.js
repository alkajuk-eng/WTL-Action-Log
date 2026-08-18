fetch("./Exele/WTLActionLog.xlsx")
  .then(response => response.arrayBuffer())
  .then(data => {
    const workbook = XLSX.read(data, { type: "array" });

    // Excel tables
    const employees = XLSX.utils.sheet_to_json(
      workbook.Sheets["Employee"]
    );

    const shifts = XLSX.utils.sheet_to_json(
      workbook.Sheets["Shift"]
    );

    const teamLeaders = XLSX.utils.sheet_to_json(
      workbook.Sheets["TeamLeader"]
    );

    const machines = XLSX.utils.sheet_to_json(
      workbook.Sheets["Machine"]
    );

    // =========================
    // LOCAL STORAGE
    // =========================

    const savedData = JSON.parse(
      localStorage.getItem("formData") || "null"
    );

    // =========================
    // DOM
    // =========================

    const dateInput =
      document.querySelector(".date");

    const sectionInput =
      document.querySelector(".section");

    const shiftInput =
      document.querySelector(".shift");

    const teamLeaderInput =
      document.querySelector(".teamLeader");

    const pageLinks =
      document.querySelectorAll(".nav-link");

    // =========================
    // SELECTED VALUES
    // =========================

    let selectedDate =
      savedData?.date ||
      new Date()
        .toISOString()
        .split("T")[0];

    let selectedSection =
      savedData?.section || "";

    let selectedShift =
      savedData?.shift || "";

    let selectedTeamLeader =
      savedData?.teamLeader || "";

    let machinesFilteredList =
      savedData?.machines || [];

    let namesFilteredList =
      savedData?.names || [];

    // =========================
    // DATE
    // =========================

    dateInput.value =
      selectedDate;

    dateInput.addEventListener(
      "change",
      () => {

        selectedDate =
          dateInput.value;

        saveFormData();
      }
    );

    // =========================
    // SECTION LIST
    // =========================

    const sectionsList = [
      ...new Set(
        employees.map(
          item => item.Section
        )
      )
    ];

    sectionsList.forEach(
      section => {

        const option =
          document.createElement(
            "option"
          );

        option.value =
          section;

        option.textContent =
          section;

        sectionInput.appendChild(
          option
        );
      }
    );

    // =========================
    // SHIFT LIST
    // =========================

    shifts.forEach(
      item => {

        const option =
          document.createElement(
            "option"
          );

        option.value =
          item.Shift;

        option.textContent =
          item.Shift;

        shiftInput.appendChild(
          option
        );
      }
    );

    // =========================
    // UPDATE TEAM LEADERS
    // =========================

    function updateTeamLeaders() {

      teamLeaderInput.innerHTML =
        "";

      const placeholder =
        document.createElement(
          "option"
        );

      placeholder.value =
        "";

      placeholder.textContent =
        "Select Team Leader";

      placeholder.disabled =
        true;

      placeholder.selected =
        true;

      teamLeaderInput.appendChild(
        placeholder
      );

      const teamLeaderList =
        teamLeaders.filter(
          item =>
            item.Section ===
            selectedSection
        );

      teamLeaderList.forEach(
        item => {

          const option =
            document.createElement(
              "option"
            );

          option.value =
            item.Name;

          option.textContent =
            item.Name;

          teamLeaderInput.appendChild(
            option
          );
        }
      );

      // Restore saved Team Leader
      if (
        selectedTeamLeader &&
        teamLeaderList.some(
          item =>
            item.Name ===
            selectedTeamLeader
        )
      ) {

        teamLeaderInput.value =
          selectedTeamLeader;
      }
    }

    // =========================
    // SECTION CHANGE
    // =========================

    sectionInput.addEventListener(
      "change",
      () => {

        selectedSection =
          sectionInput.value;

        // Update Team Leaders
        updateTeamLeaders();

        // Filter machines
        machinesFilteredList =
          machines
            .filter(
              item =>
                item.Section ===
                selectedSection
            )
            .map(
              item =>
                item.Machine
            );

        // Filter names
        namesFilteredList =
          employees
            .filter(
              item =>
                item.Section ===
                selectedSection
            )
            .map(
              item =>
                item.Name
            );

        // Save immediately
        saveFormData();

        console.log(
          "Section:",
          selectedSection
        );

        console.log(
          "Machines:",
          machinesFilteredList
        );

        console.log(
          "Names:",
          namesFilteredList
        );
      }
    );

    // =========================
    // TEAM LEADER CHANGE
    // =========================

    teamLeaderInput.addEventListener(
      "change",
      () => {

        selectedTeamLeader =
          teamLeaderInput.value;

        saveFormData();

        console.log(
          "Team Leader:",
          selectedTeamLeader
        );
      }
    );

    // =========================
    // SHIFT CHANGE
    // =========================

    shiftInput.addEventListener(
      "change",
      () => {

        selectedShift =
          shiftInput.value;

        saveFormData();

        console.log(
          "Shift:",
          selectedShift
        );
      }
    );

    // =========================
    // RESTORE SAVED DATA
    // =========================

    if (
      savedData?.section
    ) {

      selectedSection =
        savedData.section;

      sectionInput.value =
        savedData.section;

      sectionInput.dispatchEvent(
        new Event("change")
      );
    }

    if (
      savedData?.shift
    ) {

      selectedShift =
        savedData.shift;

      shiftInput.value =
        savedData.shift;
    }

    if (
      savedData?.teamLeader
    ) {

      selectedTeamLeader =
        savedData.teamLeader;

      teamLeaderInput.value =
        savedData.teamLeader;
    }

    // =========================
    // SAVE FORM DATA
    // =========================

    function saveFormData() {

      // Get existing formData
      const formData =
        JSON.parse(
          localStorage.getItem(
            "formData"
          ) || "{}"
        );

      // Update Log data
      formData.date =
        selectedDate;

      formData.section =
        selectedSection;

      formData.shift =
        selectedShift;

      formData.teamLeader =
        selectedTeamLeader;

      formData.machines =
        machinesFilteredList;

      formData.names =
        namesFilteredList;

      // IMPORTANT:
      // Do NOT overwrite attendees
      // Do NOT overwrite machineRows

      if (
        !Array.isArray(
          formData.attendees
        )
      ) {

        formData.attendees =
          [];
      }

      if (
        !Array.isArray(
          formData.machineRows
        )
      ) {

        formData.machineRows =
          [];
      }

      // Save
      localStorage.setItem(
        "formData",
        JSON.stringify(
          formData
        )
      );

      console.log(
        "Saved formData:",
        formData
      );
    }

    // =========================
    // SAVE BEFORE NAVIGATION
    // =========================

    pageLinks.forEach(
      link => {

        link.addEventListener(
          "click",
          () => {

            saveFormData();
          }
        );
      }
    );

    // =========================
    // INITIAL SAVE
    // =========================

    saveFormData();
  })
  .catch(error => {

    console.error(
      "Excel error:",
      error
    );
  });
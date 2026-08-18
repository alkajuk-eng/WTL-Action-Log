// =====================================================
// LOCAL STORAGE
// =====================================================

const savedData = JSON.parse(
  localStorage.getItem("formData") || "null"
);


// =====================================================
// DOM
// =====================================================

const reviewDate =
  document.getElementById("reviewDate");

const reviewSection =
  document.getElementById("reviewSection");

const reviewShift =
  document.getElementById("reviewShift");

const reviewTeamLeader =
  document.getElementById("reviewTeamLeader");

const attendeesList =
  document.getElementById("attendeesList");

const machinesContainer =
  document.getElementById("machinesContainer");

const backButton =
  document.getElementById("backButton");

const clearButton =
  document.getElementById("clearButton");

const saveButton =
  document.getElementById("saveButton");


// =====================================================
// SAFETY CHECK
// =====================================================

if (!savedData) {

  console.log(
    "No saved formData"
  );

}


// =====================================================
// INDEX DATA
// =====================================================

function displayIndexData() {

  if (!savedData) {
    return;
  }

  reviewDate.textContent =
    savedData.date || "-";

  reviewSection.textContent =
    savedData.section || "-";

  reviewShift.textContent =
    savedData.shift || "-";

  reviewTeamLeader.textContent =
    savedData.teamLeader || "-";
}


displayIndexData();


// =====================================================
// ATTENDEES
// =====================================================

function displayAttendees() {

  attendeesList.innerHTML = "";

  const attendees =
    Array.isArray(
      savedData?.attendees
    )
      ? savedData.attendees
      : [];


  if (attendees.length === 0) {

    const empty =
      document.createElement("div");

    empty.className =
      "empty-message";

    empty.textContent =
      "No attendees selected.";

    attendeesList.appendChild(
      empty
    );

    return;
  }


  attendees.forEach(
    name => {

      const attendee =
        document.createElement("div");

      attendee.className =
        "attendee";

      attendee.textContent =
        name;

      attendeesList.appendChild(
        attendee
      );
    }
  );
}


displayAttendees();


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHtml(value) {

  if (
    value === null ||
    value === undefined
  ) {

    return "";
  }

  return String(value)
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );
}


// =====================================================
// OBSERVATION HTML
// =====================================================

function createObservationHTML(
  title,
  observation
) {

  if (!observation) {

    return "";
  }


  const result =
    observation.result || "";

  const comments =
    observation.comments || "";

  const photo =
    observation.photo || "";


  if (
    !result &&
    !comments &&
    !photo
  ) {

    return "";
  }


  let html = `
    <div class="column">

      <span class="column-title">
        ${escapeHtml(title)}
      </span>

      <div class="column-value">
  `;


  // ===================================================
  // RESULT
  // ===================================================

  if (result) {

    const resultClass =
      result === "Good" ||
      result === "OK"
        ? "observation-good"
        : "observation-bad";


    html += `
      <div
        class="observation-result ${resultClass}"
      >
        ${escapeHtml(result)}
      </div>
    `;
  }


  // ===================================================
  // COMMENTS
  // ===================================================

  if (comments) {

    html += `
      <div class="observation-comments">
        ${escapeHtml(comments)}
      </div>
    `;
  }


  // ===================================================
  // PHOTO
  // ===================================================

  if (photo) {

    html += `
      <div class="photo-wrapper">

        <span class="photo-title">
          Photo
        </span>

        <img
          src="${escapeHtml(photo)}"
          class="review-photo"
          alt=""
        >

      </div>
    `;
  }


  html += `
      </div>
    </div>
  `;


  return html;
}


// =====================================================
// MACHINE HTML
// =====================================================

function createMachineHTML(
  machineRow
) {

  const machine =
    machineRow.machine || "-";

  const name =
    machineRow.name || "-";

  const safety =
    machineRow.safetyCheck || "-";

  const process =
    machineRow.processCheck || "-";

  const material =
    machineRow.materialCheck || "-";


  let html = `

    <div class="machine-row">

      <div class="column">

        <span class="column-title">
          Machine
        </span>

        <div class="column-value">
          ${escapeHtml(machine)}
        </div>

      </div>


      <div class="column">

        <span class="column-title">
          Name
        </span>

        <div class="column-value">
          ${escapeHtml(name)}
        </div>

      </div>


      <div class="column">

        <span class="column-title">
          Safety Check
        </span>

        <div class="column-value">
          ${escapeHtml(safety)}
        </div>

      </div>


      <div class="column">

        <span class="column-title">
          Process Check
        </span>

        <div class="column-value">
          ${escapeHtml(process)}
        </div>

      </div>


      <div class="column">

        <span class="column-title">
          Material Check
        </span>

        <div class="column-value">

          ${escapeHtml(material)}
  `;


  // ===================================================
  // MATERIAL COMMENTS
  // ===================================================

  if (
    machineRow.materialComments
  ) {

    html += `
      <div class="material-comments">
        ${escapeHtml(
          machineRow.materialComments
        )}
      </div>
    `;
  }


  html += `
        </div>

      </div>
  `;


  // ===================================================
  // OBSERVATIONS
  // ===================================================

  html += createObservationHTML(
    "Safety Observation",
    machineRow.safetyObservation
  );


  html += createObservationHTML(
    "5'S Observation",
    machineRow.fiveSObservation
  );


  html += createObservationHTML(
    "Operator Review",
    machineRow.operatorReview
  );


  html += `
    </div>
  `;


  return html;
}


// =====================================================
// REMOVE BROKEN IMAGES
// =====================================================

function removeBrokenImages() {

  const images =
    document.querySelectorAll(
      ".review-photo"
    );


  images.forEach(
    image => {

      image.addEventListener(
        "error",
        () => {

          const wrapper =
            image.closest(
              ".photo-wrapper"
            );


          if (wrapper) {

            wrapper.remove();
          }
        }
      );


      if (
        image.complete &&
        image.naturalWidth === 0
      ) {

        const wrapper =
          image.closest(
            ".photo-wrapper"
          );


        if (wrapper) {

          wrapper.remove();
        }
      }
    }
  );
}


// =====================================================
// DISPLAY MACHINES
// =====================================================

function displayMachines() {

  machinesContainer.innerHTML = "";

  const machineRows =
    Array.isArray(
      savedData?.machineRows
    )
      ? savedData.machineRows
      : [];


  if (
    machineRows.length === 0
  ) {

    const empty =
      document.createElement("div");

    empty.className =
      "empty-message";

    empty.textContent =
      "No machines selected.";

    machinesContainer.appendChild(
      empty
    );

    return;
  }


  machineRows.forEach(
    machineRow => {

      const wrapper =
        document.createElement(
          "div"
        );


      wrapper.innerHTML =
        createMachineHTML(
          machineRow
        );


      machinesContainer.appendChild(
        wrapper.firstElementChild
      );
    }
  );


  removeBrokenImages();
}


displayMachines();


// =====================================================
// BACK
// =====================================================

backButton.addEventListener(
  "click",
  () => {

    history.back();

  }
);


// =====================================================
// CLEAR
// =====================================================

clearButton.addEventListener(
  "click",
  () => {

    const confirmed =
      confirm(
        "Clear all Action Log data?"
      );


    if (!confirmed) {

      return;
    }


    localStorage.removeItem(
      "formData"
    );


    window.location.href =
      "index.html";
  }
);


// =====================================================
// LOAD IMAGE
// =====================================================

function loadImage(src) {

  return new Promise(
    resolve => {

      if (!src) {

        resolve(null);

        return;
      }


      const image =
        new Image();


      image.onload =
        () => {

          resolve(image);
        };


      image.onerror =
        () => {

          resolve(null);
        };


      image.src =
        src;
    }
  );
}


// =====================================================
// IMAGE TO DATA URL
// =====================================================

function imageToDataURL(
  image
) {

  if (!image) {

    return null;
  }


  const canvas =
    document.createElement(
      "canvas"
    );


  const maxWidth =
    1000;


  const maxHeight =
    1000;


  let width =
    image.naturalWidth ||
    image.width;


  let height =
    image.naturalHeight ||
    image.height;


  if (
    !width ||
    !height
  ) {

    return null;
  }


  const ratio =
    Math.min(
      maxWidth / width,
      maxHeight / height,
      1
    );


  width =
    Math.round(
      width * ratio
    );


  height =
    Math.round(
      height * ratio
    );


  canvas.width =
    width;


  canvas.height =
    height;


  const context =
    canvas.getContext(
      "2d"
    );


  if (!context) {

    return null;
  }


  context.drawImage(
    image,
    0,
    0,
    width,
    height
  );


  return canvas.toDataURL(
    "image/jpeg",
    0.75
  );
}


// =====================================================
// GET IMAGE FORMAT
// =====================================================

function getImageFormat(
  dataURL
) {

  if (
    dataURL.startsWith(
      "data:image/png"
    )
  ) {

    return "PNG";
  }


  return "JPEG";
}


// =====================================================
// PDF HELPERS
// =====================================================

function setPDFColor(
  pdf,
  color
) {

  pdf.setTextColor(
    color[0],
    color[1],
    color[2]
  );
}


// =====================================================
// CALCULATE MACHINE HEIGHT
// =====================================================

function calculateMachineHeight(
  pdf,
  row,
  observationWidth
) {

  let maxObservationHeight = 0;


  const observations = [

    {
      title:
        "Safety Observation",

      data:
        row.safetyObservation
    },

    {
      title:
        "5'S Observation",

      data:
        row.fiveSObservation
    },

    {
      title:
        "Operator Review",

      data:
        row.operatorReview
    }

  ];


  observations.forEach(
    observation => {

      const data =
        observation.data || {};


      if (
        !data.result &&
        !data.comments &&
        !data.photo
      ) {

        return;
      }


      let height = 10;


      if (data.result) {

        height += 6;
      }


      if (data.comments) {

        pdf.setFontSize(
          7
        );


        const comments =
          pdf.splitTextToSize(
            String(
              data.comments
            ),
            observationWidth - 4
          );


        height +=
          Math.min(
            comments.length,
            4
          ) * 3.5;
      }


      if (data.photo) {

        height += 19;
      }


      maxObservationHeight =
        Math.max(
          maxObservationHeight,
          height
        );
    }
  );


  let machineHeight = 31;


  if (
    row.materialComments
  ) {

    pdf.setFontSize(
      7
    );


    const materialComments =
      pdf.splitTextToSize(
        String(
          row.materialComments
        ),
        28
      );


    machineHeight +=
      Math.min(
        materialComments.length,
        3
      ) * 3.5;
  }


  machineHeight =
    Math.max(
      machineHeight,
      maxObservationHeight + 9
    );


  machineHeight =
    Math.max(
      machineHeight,
      38
    );


  return machineHeight;
}


// =====================================================
// DRAW MACHINE
// =====================================================

async function drawMachine(
  pdf,
  row,
  x,
  y,
  width,
  height
) {

  const pageWidth =
    pdf.internal.pageSize.getWidth();


  const innerX =
    x + 3;


  const innerWidth =
    width - 6;


  // ===================================================
  // BACKGROUND
  // ===================================================

  pdf.setFillColor(
    248,
    250,
    252
  );


  pdf.setDrawColor(
    226,
    232,
    240
  );


  pdf.roundedRect(
    x,
    y,
    width,
    height,
    2,
    2,
    "FD"
  );


  // ===================================================
  // STANDARD COLUMNS
  // ===================================================

  const standardColumnWidth =
    27;


  const standardColumns = [

    {
      title:
        "Machine",

      value:
        row.machine || "-"
    },

    {
      title:
        "Name",

      value:
        row.name || "-"
    },

    {
      title:
        "Safety",

      value:
        row.safetyCheck || "-"
    },

    {
      title:
        "Process",

      value:
        row.processCheck || "-"
    },

    {
      title:
        "Material",

      value:
        row.materialCheck || "-"
    }

  ];


  let currentX =
    innerX;


  standardColumns.forEach(
    column => {

      pdf.setTextColor(
        100,
        116,
        139
      );


      pdf.setFontSize(
        6
      );


      pdf.setFont(
        "helvetica",
        "bold"
      );


      pdf.text(
        column.title,
        currentX,
        y + 7
      );


      pdf.setTextColor(
        51,
        65,
        85
      );


      pdf.setFontSize(
        8
      );


      pdf.setFont(
        "helvetica",
        "normal"
      );


      const valueLines =
        pdf.splitTextToSize(
          String(
            column.value
          ),
          standardColumnWidth - 3
        );


      pdf.text(
        valueLines.slice(
          0,
          3
        ),
        currentX,
        y + 14
      );


      currentX +=
        standardColumnWidth;
    }
  );


  // ===================================================
  // MATERIAL COMMENTS
  // ===================================================

  if (
    row.materialComments
  ) {

    pdf.setTextColor(
      100,
      116,
      139
    );


    pdf.setFontSize(
      6.5
    );


    pdf.setFont(
      "helvetica",
      "normal"
    );


    const materialLines =
      pdf.splitTextToSize(
        String(
          row.materialComments
        ),
        standardColumnWidth - 3
      );


    pdf.text(
      materialLines.slice(
        0,
        3
      ),
      innerX +
        standardColumnWidth * 4,
      y + 20
    );
  }


  // ===================================================
  // OBSERVATIONS
  // ===================================================

  const observationStartX =
    innerX +
    standardColumnWidth * 5;


  const remainingWidth =
    innerWidth -
    standardColumnWidth * 5;


  const observationWidth =
    remainingWidth / 3;


  const observations = [

    {
      title:
        "Safety Observation",

      data:
        row.safetyObservation
    },

    {
      title:
        "5'S Observation",

      data:
        row.fiveSObservation
    },

    {
      title:
        "Operator Review",

      data:
        row.operatorReview
    }

  ];


  for (
    let index = 0;
    index < observations.length;
    index++
  ) {

    const observation =
      observations[index];


    const data =
      observation.data || {};


    if (
      !data.result &&
      !data.comments &&
      !data.photo
    ) {

      continue;
    }


    const obsX =
      observationStartX +
      index *
        observationWidth;


    // ===============================================
    // TITLE
    // ===============================================

    pdf.setTextColor(
      100,
      116,
      139
    );


    pdf.setFontSize(
      6
    );


    pdf.setFont(
      "helvetica",
      "bold"
    );


    const titleLines =
      pdf.splitTextToSize(
        observation.title,
        observationWidth - 3
      );


    pdf.text(
      titleLines.slice(
        0,
        2
      ),
      obsX,
      y + 7
    );


    // ===============================================
    // RESULT
    // ===============================================

    let currentY =
      y + 14;


    if (
      data.result
    ) {

      const good =
        data.result === "Good" ||
        data.result === "OK";


      if (good) {

        pdf.setTextColor(
          21,
          128,
          61
        );

      } else {

        pdf.setTextColor(
          220,
          38,
          38
        );
      }


      pdf.setFontSize(
        7
      );


      pdf.setFont(
        "helvetica",
        "bold"
      );


      pdf.text(
        String(
          data.result
        ),
        obsX,
        currentY
      );


      currentY +=
        5;
    }


    // ===============================================
    // COMMENTS
    // ===============================================

    if (
      data.comments
    ) {

      pdf.setTextColor(
        100,
        116,
        139
      );


      pdf.setFontSize(
        7
      );


      pdf.setFont(
        "helvetica",
        "normal"
      );


      const commentLines =
        pdf.splitTextToSize(
          String(
            data.comments
          ),
          observationWidth - 3
        );


      const visibleComments =
        commentLines.slice(
          0,
          4
        );


      pdf.text(
        visibleComments,
        obsX,
        currentY
      );


      currentY +=
        visibleComments.length *
        3.5 +
        2;
    }


    // ===============================================
    // PHOTO
    // ===============================================

    if (
      data.photo
    ) {

      const image =
        await loadImage(
          data.photo
        );


      if (image) {

        const imageData =
          imageToDataURL(
            image
          );


        if (imageData) {

          const imageWidth =
            Math.min(
              32,
              observationWidth - 4
            );


          const imageHeight =
            18;


          const maxImageBottom =
            y +
            height -
            3;


          let finalHeight =
            imageHeight;


          let finalWidth =
            imageWidth;


          if (
            currentY +
              finalHeight >
            maxImageBottom
          ) {

            finalHeight =
              Math.max(
                8,
                maxImageBottom -
                  currentY
              );


            finalWidth =
              imageWidth;
          }


          if (
            finalHeight > 5
          ) {

            pdf.addImage(
              imageData,
              getImageFormat(
                imageData
              ),
              obsX,
              currentY,
              finalWidth,
              finalHeight
            );
          }
        }
      }
    }
  }
}


// =====================================================
// PDF
// =====================================================

async function createPDF() {

  if (!savedData) {

    alert(
      "There is no data to save."
    );

    return;
  }


  saveButton.disabled =
    true;


  saveButton.textContent =
    "Creating PDF...";


  try {

    const {
      jsPDF
    } =
      window.jspdf;


    // =================================================
    // A4 LANDSCAPE
    // =================================================

    const pdf =
      new jsPDF({

        orientation:
          "landscape",

        unit:
          "mm",

        format:
          "a4",

        compress:
          true

      });


    // =================================================
    // A4 SIZE
    // =================================================

    const pageWidth =
      pdf.internal.pageSize.getWidth();


    const pageHeight =
      pdf.internal.pageSize.getHeight();


    // =================================================
    // SAFE AREA
    // =================================================

    const margin =
      10;


    const footerSpace =
      8;


    const contentWidth =
      pageWidth -
      margin * 2;


    const bottomLimit =
      pageHeight -
      margin -
      footerSpace;


    let y =
      margin;


    // =================================================
    // TITLE
    // =================================================

    setPDFColor(
      pdf,
      [
        23,
        32,
        51
      ]
    );


    pdf.setFont(
      "helvetica",
      "bold"
    );


    pdf.setFontSize(
      18
    );


    pdf.text(
      "WTL Action Log",
      margin,
      y
    );


    y +=
      7;


    pdf.setFont(
      "helvetica",
      "normal"
    );


    pdf.setFontSize(
      10
    );


    pdf.setTextColor(
      100,
      116,
      139
    );


    pdf.text(
      "Review",
      margin,
      y
    );


    y +=
      8;


    // =================================================
    // INDEX INFORMATION
    // =================================================

    const infoGap =
      3;


    const infoWidth =
      (
        contentWidth -
        infoGap * 3
      ) / 4;


    const infoHeight =
      15;


    const info = [

      [
        "Date",
        savedData.date || "-"
      ],

      [
        "Section",
        savedData.section || "-"
      ],

      [
        "Shift",
        savedData.shift || "-"
      ],

      [
        "Team Leader",
        savedData.teamLeader || "-"
      ]

    ];


    info.forEach(
      (
        item,
        index
      ) => {

        const x =
          margin +
          index *
            (
              infoWidth +
              infoGap
            );


        pdf.setFillColor(
          248,
          250,
          252
        );


        pdf.setDrawColor(
          226,
          232,
          240
        );


        pdf.roundedRect(
          x,
          y,
          infoWidth,
          infoHeight,
          2,
          2,
          "FD"
        );


        pdf.setTextColor(
          100,
          116,
          139
        );


        pdf.setFontSize(
          6.5
        );


        pdf.setFont(
          "helvetica",
          "bold"
        );


        pdf.text(
          item[0],
          x + 3,
          y + 5
        );


        pdf.setTextColor(
          23,
          32,
          51
        );


        pdf.setFontSize(
          8
        );


        pdf.setFont(
          "helvetica",
          "normal"
        );


        const valueLines =
          pdf.splitTextToSize(
            String(
              item[1]
            ),
            infoWidth - 6
          );


        pdf.text(
          valueLines.slice(
            0,
            2
          ),
          x + 3,
          y + 10
        );
      }
    );


    y +=
      infoHeight +
      7;


    // =================================================
    // ATTENDEES TITLE
    // =================================================

    pdf.setTextColor(
      23,
      32,
      51
    );


    pdf.setFont(
      "helvetica",
      "bold"
    );


    pdf.setFontSize(
      10
    );


    pdf.text(
      "Attendees",
      margin,
      y
    );


    y +=
      5;


    // =================================================
    // ATTENDEES
    // =================================================

    const attendees =
      Array.isArray(
        savedData.attendees
      )
        ? savedData.attendees
        : [];


    if (
      attendees.length === 0
    ) {

      pdf.setTextColor(
        100,
        116,
        139
      );


      pdf.setFont(
        "helvetica",
        "normal"
      );


      pdf.setFontSize(
        7
      );


      pdf.text(
        "No attendees selected.",
        margin,
        y
      );


      y +=
        7;

    } else {

      pdf.setFont(
        "helvetica",
        "normal"
      );


      pdf.setFontSize(
        7
      );


      let x =
        margin;


      let attendeeRowHeight =
        0;


      attendees.forEach(
        name => {

          const text =
            String(
              name
            );


          const width =
            Math.min(
              pdf.getTextWidth(
                text
              ) + 7,
              50
            );


          if (
            x +
              width >
            pageWidth -
              margin
          ) {

            x =
              margin;

            y +=
              6;

            attendeeRowHeight =
              0;
          }


          pdf.setFillColor(
            241,
            245,
            249
          );


          pdf.roundedRect(
            x,
            y - 3.5,
            width,
            5.5,
            1,
            1,
            "F"
          );


          pdf.setTextColor(
            51,
            65,
            85
          );


          pdf.text(
            text,
            x + 3.5,
            y
          );


          x +=
            width +
            2;


          attendeeRowHeight =
            6;
        }
      );


      y +=
        attendeeRowHeight +
        3;
    }


    // =================================================
    // MACHINES TITLE
    // =================================================

    pdf.setTextColor(
      23,
      32,
      51
    );


    pdf.setFont(
      "helvetica",
      "bold"
    );


    pdf.setFontSize(
      10
    );


    pdf.text(
      "Machines",
      margin,
      y
    );


    y +=
      5;


    // =================================================
    // MACHINE DATA
    // =================================================

    const machineRows =
      Array.isArray(
        savedData.machineRows
      )
        ? savedData.machineRows
        : [];


    if (
      machineRows.length === 0
    ) {

      pdf.setFontSize(
        7
      );


      pdf.setFont(
        "helvetica",
        "normal"
      );


      pdf.setTextColor(
        100,
        116,
        139
      );


      pdf.text(
        "No machines selected.",
        margin,
        y
      );

    } else {

      // =================================================
      // MACHINE LOOP
      // =================================================

      for (
        let i = 0;
        i < machineRows.length;
        i++
      ) {

        const row =
          machineRows[i];


        // ===============================================
        // CALCULATE OBSERVATION WIDTH
        // ===============================================

        const standardWidth =
          27 * 5;


        const observationWidth =
          (
            contentWidth -
            6 -
            standardWidth
          ) / 3;


        // ===============================================
        // CALCULATE HEIGHT
        // ===============================================

        const machineHeight =
          calculateMachineHeight(
            pdf,
            row,
            observationWidth
          );


        // ===============================================
        // PAGE CHECK
        // ===============================================

        if (
          y +
            machineHeight >
          bottomLimit
        ) {

          pdf.addPage();


          y =
            margin;
        }


        // ===============================================
        // DRAW MACHINE
        // ===============================================

        await drawMachine(
          pdf,
          row,
          margin,
          y,
          contentWidth,
          machineHeight
        );


        // ===============================================
        // NEXT MACHINE
        // ===============================================

        y +=
          machineHeight +
          4;
      }
    }


    // =================================================
    // FOOTER
    // =================================================

    const totalPages =
      pdf.getNumberOfPages();


    for (
      let page = 1;
      page <= totalPages;
      page++
    ) {

      pdf.setPage(
        page
      );


      pdf.setFont(
        "helvetica",
        "normal"
      );


      pdf.setFontSize(
        6.5
      );


      pdf.setTextColor(
        148,
        163,
        184
      );


      pdf.text(
        `WTL Action Log - Page ${page} of ${totalPages}`,
        margin,
        pageHeight - 4
      );
    }


    // =================================================
    // FILE NAME
    // =================================================

    const section =
      cleanFileName(
        savedData.section ||
        "Section"
      );


    const date =
      cleanFileName(
        savedData.date ||
        "Date"
      );


    const shift =
      cleanFileName(
        savedData.shift ||
        "Shift"
      );


    const teamLeader =
      cleanFileName(
        savedData.teamLeader ||
        "TeamLeader"
      );


    const fileName =
      `${section}_${date}_${shift}_${teamLeader}.pdf`;


    // =================================================
    // SAVE
    // =================================================

    pdf.save(
      fileName
    );

  } catch (error) {

    console.error(
      "PDF error:",
      error
    );


    alert(
      "Error creating PDF. Check the browser console."
    );

  } finally {

    saveButton.disabled =
      false;


    saveButton.textContent =
      "Save PDF";
  }
}


// =====================================================
// CLEAN FILE NAME
// =====================================================

function cleanFileName(
  value
) {

  return String(value)
    .replace(
      /[<>:"/\\|?*]/g,
      "_"
    )
    .replace(
      /\s+/g,
      "_"
    )
    .trim();
}


// =====================================================
// SAVE BUTTON
// =====================================================

saveButton.addEventListener(
  "click",
  createPDF
);
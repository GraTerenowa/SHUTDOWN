// ============================================================
// EDIT CONTENT HERE
// Change task codes/content, QR page codes/messages and final code below.
// ============================================================

const TASKS = [
  {
    id: 1,
    name: "THREE BOXES",
    answer: "483",
    type: "Numbers",
    content: "Enter the task content here."
  },
  {
    id: 2,
    name: "WIRETAP",
    answer: "las vegas",
    type: "Letters",
    content: "Agent X, we planted a wiretap on one of the traitors to learn the location of their secret base. Unfortunately, it was damaged, and we were only able to recover 4 files. Listen to them and identify the location."
  },
  {
    id: 3,
    name: "FIND THE TRAITOR",
    answer: "1234",
    type: "Numbers",
    content: "Agent X, we have detected a traitor among our agents.<br><br>This person has been working with us for 30 years, so no one expected such a betrayal.<br><br>You will recognize the traitor by their black glasses — but you will never see them wearing a tie.<br><br>Identify the agent and find their special code."
  },
  {
    id: 4,
    name: "HIDDEN CODE",
    answer: "1234",
    type: "Numbers",
    content: "Agent X, we found a board with a hidden code. Arrange the digits from smallest to largest."
  },
  {
    id: 5,
    name: "QR TRAIL",
    answer: "916",
    type: "Numbers",
    content: "Agent X, rogue agents have left behind a series of encrypted clues. Scan the QR code and follow their trail."
  },
  {
    id: 6,
    name: "LIGHT SIGNAL",
    answer: "98",
    type: "Numbers",
    content: "Agent X, receive a light signal from one of our trusted agents. Decode it to continue Operation: Shutdown."
  }
];

// Change the final code here.
const FINAL_CODE = "1109";

// QR SUBPAGES
// Each page has its own numeric access code and message.
const QR_PAGES = {
  1: {
    code: "1111",
    message: "When the night starts, some words steal the show, <br><br>Find the message that says the party should go on.<br><br>Next code:091"
  },
  2: {
    code: "091",
    message: "You don’t have to sing well to steal the show. <br><br>Find the place where every voice gets a go. <br><br>Next code:872"
  },
  3: {
    code: "872",
    message: "Green is the field, but no grass grows here.<br><br>Find the place where colored balls disappear. <br><br>Don’t stop at the first one you meet,<br><br>look for the number of the day that starts the week. <br><br>Next code:518"
  },
  4: {
    code: "518",
    message: "Code: 916"
  }
};

// ============================================================
// PAGE LOGIC
// You normally do not need to edit anything below this line.
// ============================================================

function normalizeAnswer(value) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

// ---------------- HOME PAGE ----------------

function initHomePage() {
  const taskGrid = document.getElementById("taskGrid");
  if (!taskGrid) return;

  const taskModal = document.getElementById("taskModal");
  const closeModalButton = document.getElementById("closeModal");
  const backButton = document.getElementById("backButton");
  const modalTitle = document.getElementById("modalTitle");
  const modalType = document.getElementById("modalType");
  const modalContent = document.getElementById("modalContent");
  const codeForm = document.getElementById("codeForm");
  const codeInput = document.getElementById("codeInput");
  const feedback = document.getElementById("feedback");
  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");
  const finalScreen = document.getElementById("finalScreen");
  const finalCode = document.getElementById("finalCode");

  let activeTaskId = null;
  let savedCompleted = [];

  try {
    savedCompleted = JSON.parse(localStorage.getItem("operationShutdownCompleted") || "[]");
  } catch (_) {
    savedCompleted = [];
  }

  const completedTasks = new Set(
    savedCompleted.filter((id) => TASKS.some((task) => task.id === id))
  );

  function saveProgress() {
    try {
      localStorage.setItem(
        "operationShutdownCompleted",
        JSON.stringify([...completedTasks])
      );
    } catch (_) {
      // The page still works if browser storage is unavailable.
    }
  }

  function renderTasks() {
    taskGrid.innerHTML = "";

    TASKS.forEach((task) => {
      const card = document.createElement("article");
      card.className = "task-card";

      if (completedTasks.has(task.id)) {
        card.classList.add("completed");
      }

      card.innerHTML = `
        <div>
          <div class="task-number">TASK</div>
          <h2>${task.name}</h2>
          <p class="task-type">CODE TYPE: ${task.type}</p>
        </div>
        <div>
          <div class="task-status">${completedTasks.has(task.id) ? "COMPLETED" : ""}</div>
          <button class="open-task" type="button" data-task-id="${task.id}">OPEN TASK</button>
        </div>
      `;

      taskGrid.appendChild(card);
    });

    document.querySelectorAll(".open-task").forEach((button) => {
      button.addEventListener("click", () => {
        openTask(Number(button.dataset.taskId));
      });
    });
  }

  function openTask(taskId) {
    const task = TASKS.find((item) => item.id === taskId);
    if (!task) return;

    activeTaskId = taskId;
    modalTitle.textContent = task.name;
    modalType.textContent = `CODE TYPE: ${task.type}`;
    modalContent.textContent = task.content;
    codeInput.value = "";
    feedback.textContent = completedTasks.has(taskId) ? "TASK ALREADY COMPLETED" : "";
    feedback.className = completedTasks.has(taskId) ? "feedback success" : "feedback";
    taskModal.classList.remove("hidden");

    setTimeout(() => codeInput.focus(), 50);
  }

  function closeTask() {
    taskModal.classList.add("hidden");
    activeTaskId = null;
    codeInput.value = "";
    feedback.textContent = "";
    feedback.className = "feedback";
  }

  function updateProgress() {
    const done = completedTasks.size;
    const total = TASKS.length;
    const percentage = (done / total) * 100;

    progressText.textContent = `${done} / ${total}`;
    progressBar.style.width = `${percentage}%`;

    if (done === total) {
      finalCode.textContent = FINAL_CODE;
      setTimeout(() => {
        taskModal.classList.add("hidden");
        finalScreen.classList.remove("hidden");
      }, 350);
    }
  }

  codeForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const task = TASKS.find((item) => item.id === activeTaskId);
    if (!task) return;

    const userAnswer = normalizeAnswer(codeInput.value);
    const correctAnswer = normalizeAnswer(task.answer);

    if (userAnswer === correctAnswer) {
      const wasAlreadyCompleted = completedTasks.has(task.id);
      completedTasks.add(task.id);
      saveProgress();

      feedback.textContent = wasAlreadyCompleted ? "TASK ALREADY COMPLETED" : "CODE ACCEPTED";
      feedback.className = "feedback success";

      renderTasks();
      updateProgress();
    } else {
      feedback.textContent = "INCORRECT CODE";
      feedback.className = "feedback error";
    }
  });

  closeModalButton.addEventListener("click", closeTask);
  backButton.addEventListener("click", closeTask);

  taskModal.addEventListener("click", (event) => {
    if (event.target === taskModal) {
      closeTask();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !taskModal.classList.contains("hidden")) {
      closeTask();
    }
  });

  renderTasks();
  updateProgress();
}

// ---------------- QR SUBPAGES ----------------

function initQrPage() {
  const qrPage = document.querySelector("[data-qr-page]");
  if (!qrPage) return;

  const pageId = Number(qrPage.dataset.qrPage);
  const pageData = QR_PAGES[pageId];
  if (!pageData) return;

  const qrForm = document.getElementById("qrCodeForm");
  const qrInput = document.getElementById("qrCodeInput");
  const qrFeedback = document.getElementById("qrFeedback");
  const qrGate = document.getElementById("qrGate");
  const qrMessagePanel = document.getElementById("qrMessagePanel");
  const qrMessage = document.getElementById("qrMessage");

  qrInput.addEventListener("input", () => {
    qrInput.value = qrInput.value.replace(/\D/g, "");
  });

  qrForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (qrInput.value.trim() === pageData.code) {
      qrFeedback.textContent = "ACCESS GRANTED";
      qrFeedback.className = "feedback success";
      qrMessage.textContent = pageData.message;

      setTimeout(() => {
        qrGate.classList.add("hidden");
        qrMessagePanel.classList.remove("hidden");
      }, 220);
    } else {
      qrFeedback.textContent = "INCORRECT CODE";
      qrFeedback.className = "feedback error";
      qrInput.select();
    }
  });

  setTimeout(() => qrInput.focus(), 50);
}

initHomePage();
initQrPage();

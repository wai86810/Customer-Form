(() => {
  "use strict";

  const config = window.APP_CONFIG;
  const schema = window.QUESTIONNAIRE;
  const STORAGE_KEY = `business-requirement-form:${config.FORM_VERSION}`;

  const els = {
    hero: document.getElementById("heroBlock"),
    questionnaire: document.getElementById("questionnaire"),
    success: document.getElementById("successPanel"),
    startBtn: document.getElementById("startBtn"),
    restartBtn: document.getElementById("restartBtn"),
    form: document.getElementById("requirementsForm"),
    stepContainer: document.getElementById("stepContainer"),
    stepLabel: document.getElementById("stepLabel"),
    progressLabel: document.getElementById("progressLabel"),
    progressBar: document.getElementById("progressBar"),
    backBtn: document.getElementById("backBtn"),
    nextBtn: document.getElementById("nextBtn"),
    saveBtn: document.getElementById("saveBtn"),
    submitBtn: document.getElementById("submitBtn"),
    submitStatus: document.getElementById("submitStatus"),
    draftState: document.getElementById("draftState"),
    successCaseId: document.getElementById("successCaseId")
  };

  const state = {
    answers: {},
    selectedModules: [],
    currentStepIndex: 0,
    caseId: "",
    started: false,
    savedAt: ""
  };

  initBrand();
  restoreDraft();
  bindEvents();

  function initBrand() {
    document.title = config.PAGE_TITLE;
    document.getElementById("brandName").textContent = config.BRAND_NAME;
    document.getElementById("brandMark").textContent = config.BRAND_MARK || config.BRAND_NAME.slice(0, 1).toUpperCase();
    document.getElementById("pageTitle").textContent = config.PAGE_TITLE;
    document.getElementById("pageSubtitle").textContent = config.PAGE_SUBTITLE;
    document.getElementById("footerBrand").textContent = config.BRAND_NAME;
  }

  function bindEvents() {
    els.startBtn.addEventListener("click", startForm);
    els.restartBtn.addEventListener("click", resetAll);
    els.backBtn.addEventListener("click", goBack);
    els.nextBtn.addEventListener("click", goNext);
    els.saveBtn.addEventListener("click", () => saveDraft(true));
    els.form.addEventListener("submit", submitForm);

    window.addEventListener("beforeunload", () => {
      if (state.started) saveDraft(false);
    });
  }

  function startForm() {
    state.started = true;
    els.hero.classList.add("hidden");
    els.success.classList.add("hidden");
    els.questionnaire.classList.remove("hidden");
    renderCurrentStep();
  }

  function buildSteps() {
    const steps = [...schema.coreSteps];
    const selected = schema.modules.filter(module => state.selectedModules.includes(module.id));

    selected.forEach(module => {
      steps.push({
        id: `module_${module.id}`,
        kicker: "SELECTED MODULE",
        title: module.title,
        description: module.description,
        moduleId: module.id,
        questions: module.questions
      });
    });

    steps.push(schema.finalStep);
    steps.push({ id: "summary", kicker: "REVIEW", title: "確認需求摘要", description: "送出前請快速確認；如需修改，可回到前面的步驟。", special: "summary" });
    return steps;
  }

  function renderCurrentStep() {
    const steps = buildSteps();
    if (state.currentStepIndex > steps.length - 1) state.currentStepIndex = steps.length - 1;
    const step = steps[state.currentStepIndex];

    const progress = Math.round(((state.currentStepIndex + 1) / steps.length) * 100);
    els.stepLabel.textContent = `步驟 ${state.currentStepIndex + 1} / ${steps.length}`;
    els.progressLabel.textContent = `${progress}%`;
    els.progressBar.style.width = `${progress}%`;
    els.backBtn.disabled = state.currentStepIndex === 0;
    els.nextBtn.classList.toggle("hidden", step.special === "summary");
    els.submitBtn.classList.toggle("hidden", step.special !== "summary");
    els.submitStatus.textContent = "";
    els.submitStatus.classList.remove("error");

    let body = `
      <div class="step-header">
        <div class="step-kicker">${escapeHtml(step.kicker || "")}</div>
        <h2>${escapeHtml(step.title)}</h2>
        <p>${escapeHtml(step.description || "")}</p>
      </div>`;

    if (step.special === "moduleSelector") {
      body += renderModuleSelector();
    } else if (step.special === "summary") {
      body += renderSummary();
    } else {
      const questions = (step.questions || []).filter(isQuestionVisible);
      body += `<div class="question-list">${questions.map(q => renderQuestion(q)).join("")}</div>`;
    }

    els.stepContainer.innerHTML = body;
    attachStepListeners(step);
    window.scrollTo({ top: Math.max(0, els.questionnaire.offsetTop - 18), behavior: "smooth" });
  }

  function renderModuleSelector() {
    const cards = schema.modules.map(module => {
      const checked = state.selectedModules.includes(module.id);
      return `
        <label class="module-card ${checked ? "selected" : ""}">
          <input type="checkbox" data-module-id="${module.id}" ${checked ? "checked" : ""}>
          <div class="module-title">${escapeHtml(module.title)}</div>
          <div class="module-desc">${escapeHtml(module.description)}</div>
        </label>`;
    }).join("");

    return `
      <div class="notice-box">不需要一次做完所有功能。請勾選「目前需要」或「近期很可能需要」的項目即可；下一步只會詢問您選到的模組。</div>
      <div class="module-grid">${cards}</div>`;
  }

  function renderQuestion(q) {
    const value = state.answers[q.id];
    const required = q.required ? `<span class="required-mark">*</span>` : "";
    const help = q.help ? `<p class="question-help">${escapeHtml(q.help)}</p>` : "";
    let control = "";

    if (["text", "email", "url", "number"].includes(q.type)) {
      const attrs = [
        `type="${q.type}"`,
        `data-qid="${q.id}"`,
        `value="${escapeAttr(value ?? "")}"`,
        q.placeholder ? `placeholder="${escapeAttr(q.placeholder)}"` : "",
        q.min !== undefined ? `min="${q.min}"` : "",
        q.step !== undefined ? `step="${q.step}"` : ""
      ].filter(Boolean).join(" ");
      control = `<input ${attrs}>`;
    }

    if (q.type === "textarea") {
      control = `<textarea data-qid="${q.id}" placeholder="${escapeAttr(q.placeholder || "")}">${escapeHtml(value ?? "")}</textarea>`;
    }

    if (q.type === "select") {
      control = `<select data-qid="${q.id}">
        <option value="">請選擇</option>
        ${(q.options || []).map(opt => `<option value="${escapeAttr(opt)}" ${value === opt ? "selected" : ""}>${escapeHtml(opt)}</option>`).join("")}
      </select>`;
    }

    if (q.type === "radio") {
      control = `<div class="option-grid">${(q.options || []).map(opt => {
        const checked = value === opt;
        return `<label class="option-card ${checked ? "selected" : ""}">
          <input type="radio" data-qid="${q.id}" name="${q.id}" value="${escapeAttr(opt)}" ${checked ? "checked" : ""}>
          <span>${escapeHtml(opt)}</span>
        </label>`;
      }).join("")}</div>`;
    }

    if (q.type === "checkbox") {
      const arr = Array.isArray(value) ? value : [];
      control = `<div class="option-grid">${(q.options || []).map(opt => {
        const checked = arr.includes(opt);
        return `<label class="option-card ${checked ? "selected" : ""}">
          <input type="checkbox" data-qid="${q.id}" value="${escapeAttr(opt)}" ${checked ? "checked" : ""}>
          <span>${escapeHtml(opt)}</span>
        </label>`;
      }).join("")}</div>`;
    }

    return `
      <div class="form-group" data-group-id="${q.id}">
        <label class="main-label">${escapeHtml(q.label)}${required}</label>
        ${help}
        ${control}
      </div>`;
  }

  function attachStepListeners(step) {
    if (step.special === "moduleSelector") {
      els.stepContainer.querySelectorAll("[data-module-id]").forEach(input => {
        input.addEventListener("change", e => {
          const id = e.target.dataset.moduleId;
          if (e.target.checked && !state.selectedModules.includes(id)) state.selectedModules.push(id);
          if (!e.target.checked) state.selectedModules = state.selectedModules.filter(x => x !== id);
          e.target.closest(".module-card").classList.toggle("selected", e.target.checked);
          saveDraft(false);
        });
      });
      return;
    }

    if (step.special === "summary") {
      const consent = document.getElementById("consentCheck");
      if (consent) consent.addEventListener("change", () => {
        state.answers.__consent = consent.checked;
        saveDraft(false);
      });
      return;
    }

    els.stepContainer.querySelectorAll("[data-qid]").forEach(input => {
      const eventName = (input.type === "radio" || input.type === "checkbox" || input.tagName === "SELECT") ? "change" : "input";
      input.addEventListener(eventName, e => updateAnswer(e.target));
    });
  }

  function updateAnswer(input) {
    const qid = input.dataset.qid;
    if (!qid) return;

    if (input.type === "checkbox") {
      const current = Array.isArray(state.answers[qid]) ? [...state.answers[qid]] : [];
      if (input.checked && !current.includes(input.value)) current.push(input.value);
      if (!input.checked) {
        const index = current.indexOf(input.value);
        if (index >= 0) current.splice(index, 1);
      }
      state.answers[qid] = current;
    } else if (input.type === "radio") {
      state.answers[qid] = input.value;
    } else {
      state.answers[qid] = input.value;
    }

    const option = input.closest(".option-card");
    if (option) {
      if (input.type === "radio") {
        option.parentElement.querySelectorAll(".option-card").forEach(el => el.classList.remove("selected"));
        option.classList.add("selected");
      } else {
        option.classList.toggle("selected", input.checked);
      }
    }

    saveDraft(false);

    if (questionAffectsVisibility(qid)) {
      renderCurrentStep();
    }
  }

  function questionAffectsVisibility(qid) {
    return allQuestions().some(q => q.showIf && q.showIf.question === qid);
  }

  function isQuestionVisible(q) {
    if (!q.showIf) return true;
    const current = state.answers[q.showIf.question];
    if (Object.prototype.hasOwnProperty.call(q.showIf, "equals")) return current === q.showIf.equals;
    if (Object.prototype.hasOwnProperty.call(q.showIf, "includes")) return Array.isArray(current) && current.includes(q.showIf.includes);
    return true;
  }

  function goNext() {
    if (!validateCurrentStep()) return;
    const steps = buildSteps();
    if (state.currentStepIndex < steps.length - 1) {
      state.currentStepIndex += 1;
      saveDraft(false);
      renderCurrentStep();
    }
  }

  function goBack() {
    if (state.currentStepIndex > 0) {
      state.currentStepIndex -= 1;
      saveDraft(false);
      renderCurrentStep();
    }
  }

  function validateCurrentStep() {
    const steps = buildSteps();
    const step = steps[state.currentStepIndex];
    els.stepContainer.querySelectorAll(".form-group.invalid").forEach(el => el.classList.remove("invalid"));

    if (step.special === "moduleSelector") {
      if (!state.selectedModules.length) {
        setStatus("請至少選擇一個需要評估的系統模組。", true);
        return false;
      }
      return true;
    }

    if (step.special === "summary") {
      if (!state.answers.__consent) {
        setStatus("請先勾選資料使用同意，再送出需求。", true);
        return false;
      }
      return true;
    }

    const missing = [];
    (step.questions || []).filter(isQuestionVisible).forEach(q => {
      if (!q.required) return;
      const value = state.answers[q.id];
      const empty = Array.isArray(value) ? value.length === 0 : value === undefined || value === null || String(value).trim() === "";
      if (empty) missing.push(q.id);
    });

    if (missing.length) {
      missing.forEach(id => {
        const group = els.stepContainer.querySelector(`[data-group-id="${CSS.escape(id)}"]`);
        if (group) group.classList.add("invalid");
      });
      setStatus("還有必填項目尚未完成，已用紅框標示。", true);
      const first = els.stepContainer.querySelector(".form-group.invalid");
      if (first) first.scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }
    return true;
  }

  function renderSummary() {
    const moduleNames = state.selectedModules.map(id => moduleById(id)?.title).filter(Boolean);
    const pains = [state.answers.top_pain_1, state.answers.top_pain_2, state.answers.top_pain_3].filter(Boolean);
    return `
      <div class="notice-box">這裡只顯示重點摘要。完整回答會一起送出，之後可作為需求訪談、功能規格與報價依據。</div>
      <div class="summary-grid">
        ${summaryCard("基本資料", [
          ["公司／品牌", state.answers.company_name],
          ["聯絡人", state.answers.contact_name],
          ["產業", state.answers.industry === "其他" ? state.answers.industry_other : state.answers.industry],
          ["預計使用人數", state.answers.expected_users ? `${state.answers.expected_users} 人` : "—"]
        ])}
        ${summaryCard("目前最想解決", [
          ["第一優先", state.answers.top_pain_1 || "—"],
          ["其他痛點", pains.slice(1).join("；") || "—"],
          ["最想取消的手動工作", state.answers.never_again || "—"]
        ])}
        ${summaryCard("選擇的系統模組", [
          ["模組", moduleNames.join("、") || "—"]
        ])}
        ${summaryCard("第一階段目標", [
          ["一定要有", state.answers.must_have || "—"],
          ["成功標準", state.answers.success_sentence || "—"],
          ["理想藍圖", state.answers.ideal_system || "—"]
        ])}
      </div>
      <div class="consent-box">
        <label>
          <input type="checkbox" id="consentCheck" ${state.answers.__consent ? "checked" : ""}>
          <span>我確認上述內容為目前需求方向，並同意提供本表資料作為需求分析、專案聯繫、系統規劃與報價評估之用。正式開發範圍仍以後續雙方確認的功能規格與報價／契約為準。</span>
        </label>
      </div>`;
  }

  function summaryCard(title, rows) {
    return `<div class="summary-card"><h3>${escapeHtml(title)}</h3>${rows.map(([k,v]) => `
      <div class="summary-row"><div class="summary-key">${escapeHtml(k)}</div><div class="summary-value">${escapeHtml(String(v ?? "—"))}</div></div>`).join("")}</div>`;
  }

  async function submitForm(event) {
    event.preventDefault();
    if (!validateCurrentStep()) return;

    if (!config.SUBMIT_ENDPOINT || !/^https:\/\//.test(config.SUBMIT_ENDPOINT)) {
      setStatus("目前尚未在 config.js 設定 Google Apps Script Web App 網址，因此不會送出資料。請先完成 README 的後端設定。", true);
      return;
    }

    const submitButton = els.submitBtn;
    submitButton.disabled = true;
    submitButton.textContent = "送出中…";
    setStatus("正在安全送出需求資料…", false);

    if (!state.caseId) state.caseId = generateCaseId();
    const payload = buildPayload();

    try {
      const body = new URLSearchParams();
      body.set("payload", JSON.stringify(payload));
      body.set("_fax_number", ""); // honeypot

      await fetch(config.SUBMIT_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
        body: body.toString()
      });

      localStorage.removeItem(STORAGE_KEY);
      els.successCaseId.textContent = state.caseId;
      els.questionnaire.classList.add("hidden");
      els.success.classList.remove("hidden");
      els.draftState.textContent = "已送出";
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error(error);
      setStatus("送出失敗，請確認網路狀態後再試一次。您的填寫內容仍保留在這台裝置。", true);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "確認並送出";
    }
  }

  function buildPayload() {
    const fieldMap = collectFieldMap();
    const fields = [];
    const steps = buildSteps();

    steps.forEach(step => {
      (step.questions || []).filter(isQuestionVisible).forEach(q => {
        const value = state.answers[q.id];
        if (isEmptyValue(value)) return;
        fields.push({ id: q.id, section: step.title, label: q.label, value });
      });
    });

    const complexity = estimateComplexity();
    return {
      meta: {
        case_id: state.caseId,
        submitted_at: new Date().toISOString(),
        form_version: config.FORM_VERSION,
        page_url: window.location.href,
        complexity_score: complexity.score,
        complexity_label: complexity.label
      },
      contact: {
        company_name: state.answers.company_name || "",
        contact_name: state.answers.contact_name || "",
        email: state.answers.contact_email || "",
        phone: state.answers.contact_phone || "",
        industry: state.answers.industry === "其他" ? state.answers.industry_other || "其他" : state.answers.industry || ""
      },
      selected_modules: state.selectedModules.map(id => ({ id, title: moduleById(id)?.title || id })),
      answers: { ...state.answers, __consent: undefined },
      fields,
      field_map: fieldMap
    };
  }

  function collectFieldMap() {
    const result = {};
    allQuestions().forEach(q => { result[q.id] = q.label; });
    return result;
  }

  function estimateComplexity() {
    let score = state.selectedModules.length;
    const weights = { integration: 2, manufacturing: 2, permissions: 1, documents: 1, automation: 1, finance: 1 };
    state.selectedModules.forEach(id => { score += weights[id] || 0; });
    const users = Number(state.answers.expected_users || 0);
    if (users > 10) score += 1;
    if (users > 30) score += 1;
    if ((state.answers.current_tools || []).length >= 4) score += 1;

    if (score <= 4) return { score, label: "基礎" };
    if (score <= 8) return { score, label: "標準" };
    if (score <= 13) return { score, label: "進階" };
    return { score, label: "高度客製" };
  }

  function generateCaseId() {
    const now = new Date();
    const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
    const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `${config.CASE_PREFIX}-${date}-${suffix}`;
  }

  function saveDraft(showMessage) {
    if (!state.started && !Object.keys(state.answers).length) return;
    state.savedAt = new Date().toISOString();
    const snapshot = {
      answers: state.answers,
      selectedModules: state.selectedModules,
      currentStepIndex: state.currentStepIndex,
      caseId: state.caseId,
      started: state.started,
      savedAt: state.savedAt
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    updateDraftState();
    if (showMessage) setStatus("草稿已儲存在這台裝置。", false);
  }

  function restoreDraft() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      updateDraftState();
      return;
    }
    try {
      const saved = JSON.parse(raw);
      Object.assign(state, saved);
      state.answers = saved.answers || {};
      state.selectedModules = saved.selectedModules || [];
      els.startBtn.textContent = "繼續上次填寫";
      updateDraftState();
    } catch (error) {
      console.warn("Unable to restore draft", error);
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  function updateDraftState() {
    if (!state.savedAt) {
      els.draftState.textContent = "尚未填寫";
      return;
    }
    const time = new Date(state.savedAt);
    els.draftState.textContent = `草稿已儲存 ${time.toLocaleString("zh-TW", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })}`;
  }

  function resetAll() {
    localStorage.removeItem(STORAGE_KEY);
    state.answers = {};
    state.selectedModules = [];
    state.currentStepIndex = 0;
    state.caseId = "";
    state.started = false;
    state.savedAt = "";
    els.startBtn.textContent = "開始需求分析";
    els.success.classList.add("hidden");
    els.questionnaire.classList.add("hidden");
    els.hero.classList.remove("hidden");
    updateDraftState();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function allQuestions() {
    const list = [];
    schema.coreSteps.forEach(step => (step.questions || []).forEach(q => list.push(q)));
    schema.modules.forEach(module => module.questions.forEach(q => list.push(q)));
    (schema.finalStep.questions || []).forEach(q => list.push(q));
    return list;
  }

  function moduleById(id) {
    return schema.modules.find(m => m.id === id);
  }

  function isEmptyValue(value) {
    if (Array.isArray(value)) return value.length === 0;
    return value === undefined || value === null || String(value).trim() === "";
  }

  function setStatus(message, isError) {
    els.submitStatus.textContent = message;
    els.submitStatus.classList.toggle("error", Boolean(isError));
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function escapeAttr(value) {
    return escapeHtml(value).replaceAll("`", "&#096;");
  }
})();

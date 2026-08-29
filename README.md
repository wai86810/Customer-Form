# 通用型客戶需求分析系統

這是一套可部署在 **GitHub Pages** 的通用型企業需求調查表。它不是針對單一產業寫死的問卷，而是先讓客戶選擇需要的營運模組，再自動顯示相關問題。

## 特色

- 同一個網址可給不同產業客戶使用
- 依需求動態顯示 CRM、訂單、庫存、採購、案件、製造、財務、權限、串接、自動化等模組
- 多步驟填寫與進度條
- 手機／平板／電腦 RWD
- 瀏覽器 localStorage 自動暫存
- 送出前需求摘要
- 自動產生案件編號
- 送出至 Google Sheet
- 可選 Email 通知
- 可選 Discord 通知，Webhook 不放在前端
- 問題集中在 `questions.js`，之後增刪題目不用重寫畫面

---

## 專案檔案

```text
index.html        網頁骨架
styles.css        版面與 RWD
config.js         品牌名稱、案件前綴、Apps Script 網址
questions.js      所有共通問題與各模組題庫
app.js            分頁、條件式問題、暫存、送出邏輯
gas/Code.gs       Google Apps Script 後端
```

---

# 1. 先部署 GitHub Pages

1. 在 GitHub 建立新的 Repository，例如 `Customer-Requirement-Form`。
2. 把根目錄下的 `index.html`、`styles.css`、`config.js`、`questions.js`、`app.js` 上傳到 Repository。
3. GitHub Repository → **Settings** → **Pages**。
4. Source 選擇 **Deploy from a branch**。
5. Branch 選擇 `main` / `(root)`。
6. 等待 GitHub Pages 產生網址。

> `gas/Code.gs` 不需要上傳到 GitHub Pages 才能運作；它是另外貼到 Google Apps Script 的後端程式。

---

# 2. 建立 Google Sheet

1. 建立一份新的 Google Sheet，例如「客戶需求回覆」。
2. 從網址複製 Spreadsheet ID。

例如：

```text
https://docs.google.com/spreadsheets/d/【這一段就是 SPREADSHEET_ID】/edit
```

不需要自己建立欄位，後端收到第一筆資料後會自動建立表頭。

---

# 3. 建立 Google Apps Script 後端

1. 到 `script.google.com` 建立 Apps Script 專案。
2. 把 `gas/Code.gs` 全部貼到 `Code.gs`。
3. 左側 **專案設定 / Project Settings** → **Script Properties**。
4. 新增：

```text
SPREADSHEET_ID = 你的 Google Sheet ID
```

選配：收到需求時寄 Email：

```text
NOTIFY_EMAIL = your@email.com
```

選配：Discord 通知：

```text
DISCORD_WEBHOOK = 你的 Discord Webhook
```

**不要把 Discord Webhook 寫在 GitHub 的 HTML / JavaScript。**

---

# 4. 部署 Apps Script Web App

1. Apps Script 右上角 **Deploy** → **New deployment**。
2. Type 選 **Web app**。
3. Execute as 選 **Me**。
4. Who has access 選 **Anyone**。
5. Deploy。
6. 複製 `/exec` 結尾的 Web App URL。

---

# 5. 把後端網址貼回 GitHub

打開 `config.js`：

```js
SUBMIT_ENDPOINT: "https://script.google.com/macros/s/你的部署ID/exec",
```

同一個檔案也可以改品牌：

```js
BRAND_NAME: "你的品牌",
BRAND_MARK: "A",
CASE_PREFIX: "REQ",
```

Commit 後重新整理 GitHub Pages 即可。

---

# 6. 如何調整題目

所有題目都集中在 `questions.js`。

一般文字題：

```js
{
  id: "example",
  type: "text",
  label: "問題文字",
  required: true
}
```

單選：

```js
{
  id: "example_radio",
  type: "radio",
  label: "是否需要？",
  options: ["需要", "不需要", "不確定"]
}
```

複選：

```js
{
  id: "example_checkbox",
  type: "checkbox",
  label: "需要哪些功能？",
  options: ["功能 A", "功能 B", "功能 C"]
}
```

條件式顯示：

```js
{
  id: "website_url",
  type: "url",
  label: "網址",
  showIf: {
    question: "has_website",
    equals: "有"
  }
}
```

複選條件：

```js
showIf: {
  question: "some_checkbox",
  includes: "其他"
}
```

---

# 7. 建議正式使用前測試

至少測試：

- 電腦 Chrome
- iPhone / Android 手機
- 中途關閉後重新打開，草稿是否存在
- 不同產業只選不同模組，題目是否正確變化
- Google Sheet 是否收到資料
- Email / Discord 通知是否正常

---

## 安全注意事項

GitHub Pages 上的 HTML、JavaScript、設定檔都是公開的，因此：

- 不要把 Discord Webhook 放在前端
- 不要把 API Secret 放在前端
- 不要把私人 Token 放在 GitHub
- Secret 請放在 Apps Script 的 Script Properties

本版本已將通知 Webhook 移至 Google Apps Script 後端。

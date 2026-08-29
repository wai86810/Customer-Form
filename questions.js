window.QUESTIONNAIRE = {
  coreSteps: [
    {
      id: "basic",
      kicker: "STEP 01",
      title: "先認識您的公司",
      description: "這些資料讓我們了解您的營運型態與系統使用情境。",
      questions: [
        { id: "company_name", type: "text", label: "公司／品牌名稱", required: true, placeholder: "例如：○○工作室／○○有限公司" },
        { id: "contact_name", type: "text", label: "主要聯絡人", required: true },
        { id: "contact_role", type: "text", label: "您的職稱／角色", placeholder: "例如：負責人、營運主管、行政" },
        { id: "contact_email", type: "email", label: "Email", placeholder: "方便後續聯繫與寄送需求摘要" },
        { id: "contact_phone", type: "text", label: "電話／LINE（選填）" },
        { id: "industry", type: "select", label: "產業類別", required: true, options: [
          "零售／門市", "電商／網路品牌", "批發／貿易", "製造業", "專業服務／顧問", "接案／專案型服務",
          "維修／售後服務", "美容／保養／健康服務", "餐飲／食品", "不動產／地政／代辦", "教育／培訓",
          "工程／營造", "物流／倉儲", "社團／協會／非營利", "其他"
        ]},
        { id: "industry_other", type: "text", label: "其他產業說明", showIf: { question: "industry", equals: "其他" } },
        { id: "team_size", type: "number", label: "目前團隊人數", min: 1, placeholder: "人" },
        { id: "expected_users", type: "number", label: "預計會使用系統的人數", min: 1, placeholder: "人" },
        { id: "business_models", type: "checkbox", label: "主要營業模式（可複選）", options: ["實體門市", "網路銷售", "批發", "零售", "B2B", "B2C", "接案／專案", "預約服務", "訂閱制", "其他"] },
        { id: "business_model_other", type: "text", label: "其他營業模式", showIf: { question: "business_models", includes: "其他" } }
      ]
    },
    {
      id: "current",
      kicker: "STEP 02",
      title: "現在是怎麼工作的？",
      description: "我們想先理解現況，不急著談功能。流程越具體，後續規劃越準。",
      questions: [
        { id: "current_tools", type: "checkbox", label: "目前主要使用哪些工具？", required: true, options: ["Excel", "Google Sheet", "紙本", "LINE", "Messenger", "Email", "POS", "ERP", "會計軟體", "Notion", "其他系統", "沒有固定系統"] },
        { id: "current_tools_other", type: "text", label: "其他系統／工具名稱", showIf: { question: "current_tools", includes: "其他系統" } },
        { id: "daily_workflow", type: "textarea", label: "請用白話描述目前一天或一筆工作的流程", required: true, help: "例如：客戶詢問 → 報價 → 接單 → 登記 Excel → 備貨 → 出貨 → 收款 → 對帳。" },
        { id: "repeated_work", type: "textarea", label: "哪些事情每天／每週一直重複做，最消耗時間？", help: "例如：重複輸入資料、人工對帳、找 LINE 訊息、整理報表。" },
        { id: "error_prone", type: "textarea", label: "哪一類工作最容易出錯、漏掉或需要反覆確認？" },
        { id: "time_waste_hours", type: "number", label: "估計每週花在重複行政／整理資料的時間", min: 0, step: 0.5, placeholder: "小時／週" }
      ]
    },
    {
      id: "pain",
      kicker: "STEP 03",
      title: "最想解決的痛點",
      description: "請從經營者的角度回答：什麼問題真的讓您覺得麻煩？",
      questions: [
        { id: "pain_points", type: "checkbox", label: "目前經常遇到哪些問題？", options: [
          "資料散落在不同 Excel／Sheet", "LINE／Email 訊息太多難追蹤", "重複輸入相同資料", "不知道事情做到哪一步",
          "訂單／案件容易漏掉", "客戶資料難整理", "庫存數量不準", "採購／進貨難追蹤", "收款／對帳很花時間",
          "收入支出難整理", "老闆無法快速掌握營運數字", "不同員工紀錄方式不同", "報表要人工整理",
          "現有系統太複雜", "現有系統不符合公司流程", "跨系統資料無法串接", "權限不好管理", "其他"
        ]},
        { id: "pain_other", type: "text", label: "其他痛點", showIf: { question: "pain_points", includes: "其他" } },
        { id: "top_pain_1", type: "text", label: "如果只能先改善一件事，第一名是什麼？", required: true },
        { id: "top_pain_2", type: "text", label: "第二名希望改善什麼？" },
        { id: "top_pain_3", type: "text", label: "第三名希望改善什麼？" },
        { id: "never_again", type: "textarea", label: "如果明天開始有一件工作可以完全不用再手動處理，您最希望是哪一件？", required: true }
      ]
    },
    {
      id: "modules",
      kicker: "STEP 04",
      title: "這套系統需要管理哪些事情？",
      description: "請勾選目前有需要或近期會需要的項目。系統會依您的選擇，只顯示相關問題。",
      special: "moduleSelector"
    }
  ],

  modules: [
    {
      id: "crm", title: "客戶／會員 CRM", description: "客戶資料、歷史紀錄、分級、回購與聯繫。",
      questions: [
        { id: "crm_data", type: "checkbox", label: "希望保存哪些客戶資料？", options: ["姓名／公司", "電話", "Email", "地址", "LINE／社群", "統編", "歷史交易／案件", "累積消費", "最後聯絡日期", "客戶等級", "標籤", "備註"] },
        { id: "crm_sources", type: "checkbox", label: "客戶資料目前從哪裡來？", options: ["官網會員", "LINE", "電話", "Email", "業務開發", "門市", "活動／名單", "Excel 匯入", "其他"] },
        { id: "crm_classification", type: "radio", label: "是否需要客戶分類／標籤？", options: ["需要", "不需要", "不確定"] },
        { id: "crm_followup", type: "checkbox", label: "希望系統協助哪些客戶經營？", options: ["回購提醒", "久未聯繫提醒", "VIP／高價值客戶", "生日／特殊日期", "待追蹤商機", "自動記錄互動", "目前不需要"] },
        { id: "crm_current_problem", type: "textarea", label: "目前管理客戶最麻煩的地方是什麼？" }
      ]
    },
    {
      id: "sales", title: "訂單／銷售管理", description: "報價、接單、訂單狀態、出貨、退款與銷售紀錄。",
      questions: [
        { id: "sales_sources", type: "checkbox", label: "訂單／交易從哪些地方進來？", options: ["官方網站", "LINE", "電話", "Email", "業務", "實體門市", "蝦皮／商城", "其他電商", "人工建立"] },
        { id: "sales_flow", type: "textarea", label: "從接到訂單到完成交易，目前流程是什麼？", required: true },
        { id: "sales_status", type: "checkbox", label: "需要哪些訂單狀態？", options: ["新訂單", "待確認", "待付款", "已付款", "備貨中", "已出貨", "已完成", "取消", "退貨", "退款", "自訂狀態"] },
        { id: "sales_auto", type: "checkbox", label: "訂單成立後，希望自動做哪些事情？", options: ["扣庫存", "增加營收", "建立應收帳款", "更新客戶累積消費", "通知員工", "提醒出貨", "寄送通知", "產生文件", "其他"] },
        { id: "sales_returns", type: "radio", label: "是否需要管理取消／退貨／退款？", options: ["需要", "不需要", "不確定"] },
        { id: "sales_problem", type: "textarea", label: "目前接單／訂單流程最困擾的是什麼？" }
      ]
    },
    {
      id: "inventory", title: "商品／庫存管理", description: "成品、原料、耗材、安全庫存、批號與效期。",
      questions: [
        { id: "inventory_types", type: "checkbox", label: "需要管理哪些類型的庫存？", required: true, options: ["可販售成品", "原料", "包材", "耗材", "零件", "半成品", "設備／工具", "其他"] },
        { id: "inventory_locations", type: "radio", label: "是否有多個倉庫／門市／存放地點？", options: ["只有一個", "有多個", "目前沒有但未來可能有"] },
        { id: "inventory_features", type: "checkbox", label: "希望有哪些庫存功能？", options: ["進貨入庫", "銷售出庫", "人工調整", "盤點", "安全庫存提醒", "調撥", "庫存異動紀錄", "即時庫存", "可用量／保留量"] },
        { id: "inventory_batch", type: "checkbox", label: "是否需要追蹤以下資訊？", options: ["批號", "有效期限", "序號", "規格／尺寸", "顏色／款式", "成本批次", "都不需要"] },
        { id: "inventory_problem", type: "textarea", label: "目前庫存管理最常遇到什麼問題？" }
      ]
    },
    {
      id: "purchasing", title: "採購／供應商管理", description: "供應商、詢價、採購、進貨、歷史價格與付款。",
      questions: [
        { id: "supplier_count", type: "number", label: "目前大約有多少家供應商？", min: 0 },
        { id: "supplier_data", type: "checkbox", label: "希望保存哪些供應商資訊？", options: ["公司／聯絡人", "聯絡方式", "供應品項", "報價／採購價格", "付款條件", "交期", "歷史採購", "合約／文件", "備註"] },
        { id: "purchase_flow", type: "textarea", label: "目前從需要採購到完成進貨，流程是什麼？" },
        { id: "purchase_features", type: "checkbox", label: "希望系統提供哪些功能？", options: ["採購單", "進貨紀錄", "應付款", "歷史價格比較", "低庫存產生採購建議", "交期追蹤", "採購審核", "供應商評比"] },
        { id: "purchase_problem", type: "textarea", label: "目前採購／供應商管理最麻煩的是什麼？" }
      ]
    },
    {
      id: "projects", title: "案件／專案／服務管理", description: "案件進度、任務、預約、維修或服務型工作流程。",
      questions: [
        { id: "work_type", type: "checkbox", label: "您的工作比較接近哪些類型？", required: true, options: ["案件／代辦", "專案", "顧問服務", "預約服務", "維修／售後", "工程／施工", "長期合約服務", "其他"] },
        { id: "work_status", type: "textarea", label: "一個案件／專案通常會經過哪些階段？", help: "例如：詢問 → 報價 → 簽約 → 執行 → 待客戶資料 → 完成 → 收款。" },
        { id: "work_features", type: "checkbox", label: "希望管理哪些內容？", options: ["案件編號", "客戶", "負責人", "進度狀態", "截止日期", "待辦任務", "文件附件", "報價／費用", "收款", "內部備註", "客戶通知", "工時"] },
        { id: "appointments", type: "radio", label: "是否需要預約／行事曆排程？", options: ["需要", "不需要", "可能需要"] },
        { id: "project_problem", type: "textarea", label: "目前追蹤案件／服務進度最困擾的是什麼？" }
      ]
    },
    {
      id: "manufacturing", title: "生產／製造管理", description: "配方 BOM、工單、原料扣料、生產入庫與製程。",
      questions: [
        { id: "mfg_type", type: "checkbox", label: "生產流程包含哪些項目？", options: ["配方／BOM", "原料領料", "生產工單", "委外加工", "製程站點", "品質檢驗", "成品入庫", "批號追溯"] },
        { id: "mfg_bom", type: "radio", label: "產品是否有固定配方／BOM？", options: ["有", "沒有", "部分有", "不確定"] },
        { id: "mfg_auto_deduct", type: "radio", label: "生產完成後是否希望自動扣原料、增加成品庫存？", options: ["需要", "不需要", "希望評估"] },
        { id: "mfg_traceability", type: "checkbox", label: "需要追溯哪些資訊？", options: ["原料批號", "成品批號", "生產日期", "操作人員", "檢驗結果", "效期", "供應商批次", "不需要"] },
        { id: "mfg_problem", type: "textarea", label: "目前生產／製造流程最麻煩的是什麼？" }
      ]
    },
    {
      id: "finance", title: "財務／收支管理", description: "營收、成本、毛利、支出、應收應付與經營數字。",
      questions: [
        { id: "finance_goal", type: "checkbox", label: "最希望系統自動算出哪些數字？", required: true, options: ["每日／週／月營收", "商品／服務成本", "毛利", "毛利率", "固定支出", "變動支出", "淨利概況", "應收帳款", "應付帳款", "現金流概況", "客單價", "其他"] },
        { id: "finance_profit_meaning", type: "radio", label: "當您說「這個月賺多少」，最接近哪一種？", options: ["只看營業額", "營業額－商品／服務成本＝毛利", "希望連其他費用一起扣除，看最後剩多少", "以上都想看"] },
        { id: "finance_expenses", type: "textarea", label: "除了進貨／商品成本，公司還有哪些主要支出？", help: "例如：薪資、廣告、租金、運費、平台費、外包、耗材。" },
        { id: "finance_source", type: "checkbox", label: "收入／支出資料目前從哪裡來？", options: ["訂單自動產生", "人工登記", "銀行／金流", "會計軟體", "Excel", "發票資料", "其他"] },
        { id: "finance_accounting_scope", type: "radio", label: "您需要的是「經營管理數字」還是「正式會計帳務」？", options: ["經營管理數字即可", "需要正式會計／報稅等級", "兩者都希望有", "不確定，需要討論"] },
        { id: "finance_questions", type: "textarea", label: "如果財務頁面能回答三個問題，您最想知道哪三件事？" }
      ]
    },
    {
      id: "dashboard", title: "Dashboard／報表", description: "老闆首頁、KPI、趨勢、排行與匯出報表。",
      questions: [
        { id: "dashboard_numbers", type: "checkbox", label: "每天打開系統最想看到哪些資訊？", options: ["今日營收", "本週營收", "本月營收", "訂單／案件數", "待處理工作", "未收款", "庫存不足", "採購金額", "毛利／毛利率", "支出", "客戶成長", "銷售排行", "員工進度", "其他"] },
        { id: "dashboard_period", type: "checkbox", label: "希望報表可切換哪些期間？", options: ["今天", "本週", "本月", "本季", "本年度", "去年同期", "自訂日期"] },
        { id: "dashboard_compare", type: "radio", label: "是否需要做期間比較？", options: ["需要，例如本月 vs 上月", "不用", "有會更好"] },
        { id: "dashboard_export", type: "checkbox", label: "需要匯出哪些格式？", options: ["Excel／CSV", "PDF", "列印", "不需要匯出"] },
        { id: "dashboard_30sec", type: "textarea", label: "如果您每天只花 30 秒看首頁，希望它直接告訴您什麼？", required: true }
      ]
    },
    {
      id: "permissions", title: "帳號／角色／權限", description: "老闆、主管、員工看到不同資料，並留下操作紀錄。",
      questions: [
        { id: "roles", type: "textarea", label: "預計有哪些使用者角色？", help: "例如：老闆、行政、業務、倉庫、會計、門市。" },
        { id: "owner_only", type: "checkbox", label: "哪些資料只有老闆／主管能看到？", options: ["營收", "毛利／淨利", "商品成本", "採購成本", "公司支出", "薪資／人事", "供應商價格", "完整客戶資料", "全部財務資料", "其他"] },
        { id: "permission_actions", type: "checkbox", label: "需要限制哪些操作？", options: ["查看", "新增", "修改", "刪除", "匯出", "審核", "查看成本", "查看財務", "系統設定"] },
        { id: "audit_log", type: "radio", label: "是否需要記錄「誰在什麼時間修改了什麼」？", options: ["需要", "不需要", "有會比較安心"] },
        { id: "permission_notes", type: "textarea", label: "請描述您理想中的權限規則" }
      ]
    },
    {
      id: "integration", title: "官網／電商／外部系統串接", description: "讓網站、電商、表單、金流或既有系統自動交換資料。",
      questions: [
        { id: "has_website", type: "radio", label: "目前是否有官網／電商／既有系統？", required: true, options: ["有", "沒有", "正在規劃"] },
        { id: "website_url", type: "url", label: "網址（若有）", showIf: { question: "has_website", equals: "有" }, placeholder: "https://..." },
        { id: "website_platform", type: "select", label: "使用什麼平台？", showIf: { question: "has_website", equals: "有" }, options: ["WordPress／WooCommerce", "SHOPLINE", "CYBERBIZ", "Shopify", "WACA", "Google Apps Script", "自架網站", "其他", "不知道"] },
        { id: "integration_targets", type: "checkbox", label: "希望串接哪些服務？", options: ["官網會員", "官網訂單", "電商平台", "LINE", "Email", "Google Calendar", "Google Sheet", "金流", "物流", "電子發票", "會計軟體", "NAS／內部資料庫", "其他 API"] },
        { id: "integration_direction", type: "checkbox", label: "希望資料怎麼流動？", options: ["外部資料自動進系統", "系統資料回寫外部平台", "雙向同步", "只要定期匯入即可", "不確定，需要評估"] },
        { id: "integration_problem", type: "textarea", label: "最希望解決哪一個「跨系統搬資料」的問題？" }
      ]
    },
    {
      id: "documents", title: "文件／簽核／表單", description: "報價單、收據、合約、申請表、附件與內部簽核流程。",
      questions: [
        { id: "document_types", type: "checkbox", label: "常用哪些文件？", options: ["報價單", "訂單", "出貨單", "採購單", "收據／請款單", "合約", "案件文件", "申請表", "檢查表", "客戶附件", "其他"] },
        { id: "document_generate", type: "radio", label: "是否希望系統自動帶入資料產生文件？", options: ["需要", "不需要", "部分文件需要"] },
        { id: "approval_needed", type: "radio", label: "是否有內部簽核／主管審核流程？", options: ["有", "沒有", "未來可能有"] },
        { id: "approval_flow", type: "textarea", label: "若有簽核，請描述目前流程", showIf: { question: "approval_needed", equals: "有" } },
        { id: "document_problem", type: "textarea", label: "目前文件／簽核最花時間的是什麼？" }
      ]
    },
    {
      id: "automation", title: "提醒／自動化／AI", description: "把重複工作交給系統，並主動提醒真正需要人處理的事情。",
      questions: [
        { id: "easy_to_forget", type: "textarea", label: "有哪些事情如果沒人提醒，很容易忘記？", required: true },
        { id: "automation_wish", type: "checkbox", label: "哪些自動化對您最有幫助？", options: ["自動扣／加庫存", "自動產生收款／帳務紀錄", "自動計算營收／毛利", "未收款提醒", "庫存不足提醒", "工作逾期提醒", "自動產生報表", "自動寄 Email／通知", "自動產生文件", "跨系統同步", "定期備份", "其他"] },
        { id: "ai_interest", type: "checkbox", label: "是否對 AI 輔助功能有興趣？", options: ["AI 整理資料", "AI 摘要案件／訂單", "AI 分析營運數據", "AI 產生報表說明", "AI 客戶回覆草稿", "AI 文件辨識／分類", "目前不需要 AI", "想先了解"] },
        { id: "alerts", type: "textarea", label: "什麼狀況發生時，希望系統主動警告您？" },
        { id: "dream_automation", type: "textarea", label: "有沒有一件事您曾想過：「如果系統可以自己幫我做就好了」？", required: true }
      ]
    }
  ],

  finalStep: {
    id: "final",
    kicker: "FINAL",
    title: "優先順序與理想藍圖",
    description: "最後請幫我們分清楚「現在一定要解決」和「未來可以再做」的差別。",
    questions: [
      { id: "must_have", type: "textarea", label: "第一階段一定要有的功能／成果", required: true, help: "建議列 3–5 項。沒有這些，就失去導入系統的意義。" },
      { id: "nice_to_have", type: "textarea", label: "希望有，但第一階段沒有也可以的功能" },
      { id: "future", type: "textarea", label: "未來公司成長後可能需要的功能" },
      { id: "success_sentence", type: "textarea", label: "請完成這句話：「如果這套系統可以幫我＿＿＿＿，我會覺得非常值得。」", required: true },
      { id: "ideal_system", type: "textarea", label: "如果完全不考慮技術與開發難度，您心目中最理想的系統應該做到什麼？", required: true },
      { id: "reference", type: "textarea", label: "有沒有看過很喜歡的系統／網站／APP？可以提供名稱、網址或描述。" },
      { id: "target_timing", type: "radio", label: "希望大約什麼時候可以開始使用？", options: ["越快越好", "1 個月內", "1–3 個月", "3 個月以上", "先評估，不急"] },
      { id: "budget_status", type: "radio", label: "目前對專案預算的想法", help: "此題只用於評估適合的開發範圍，不代表最終報價。", options: ["還沒有概念，希望先評估", "希望先做最必要的功能", "已有預算範圍，之後面談", "功能完整度優先，預算可再討論"] },
      { id: "other_notes", type: "textarea", label: "還有任何我們沒問到，但您覺得很重要的事情嗎？" }
    ]
  }
};

# vite-vue3-template
**** This is just for interview demo to show part of code. ****

## 專案簡介

此為Vue3專案開發初始模板，包含UI Style Gudieline上定義的Components，以Vite作為建構工具。
請參考 [服務系統Guidline 2.0](https://app.zeplin.io/project/62abf2c8d43a881ab03ebfa2) 獲得詳細Components設計資訊。

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [ESlint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [GitGraph](https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## 專案目錄結構

詳細配置請見專案內檔案範例

```sh
.
├── .husky/
│   ├── _/
│   ├── commit-msg # commit訊息格式校驗
│   └── pre-commit # commit前Eslint檢查
├── api-interface # API介面，以express-mockjs來模擬API接口
│   ├── mocks
│   │   ├── domain # API入口
│   │   ├── SSO # API入口
│   │   ... 
│   └── app.js
├── node_modules/
├── public/
├── src/
│   ├── __tests__/ # 單元測試
│   │   └── unit/
│   │       └── utils/ # 欲測試目錄
│   │           └── format.test.js # 欲測試檔案 (/utils/format.js)
│   │           ...
│   ├── api/ 
│   │   ├── request/ # 請求相關
│   │   │    ├── request.js # 請求管理
│   │   │    └── urlConfig.js # 路徑管理
│   │   ├── service/ # API service，可預先處理回應資料
│   │   └── index.js # export APIs
│   ├── assets/ # 靜態資源
│   │   ├── icon/    
│   │   ├── images/
│   │   └── tailwind.css
│   ├── components/ # 元件
│   │   ├── common/ # 一般通用component
│   │   └── layouts/ # 佈局vue檔component
│   ├── composables/ # 可重用的功能邏輯
│   ├── map/ # 便於映射資料與樣式資訊，可用於狀態管理、介面渲染
│   │   └── menu.js # menu相關map物件
│   ├── modules/ # 適用於模組切分的專案
│   ├── router/ 
│   ├── stores/ # 狀態管理，使用pinia
│   ├── style/ # sass樣式檔
│   ├── utils/ # 共用方法一律放置於此
│   ├── views/ # 頁面
│   ├── App.vue
│   └── main.js
├── .cz-config.js # git commit message types  
├── .editorconfig # 統一不同編輯器程式碼風格配置文件
├── .eslintrc.cjs # ESlint配置
├── .gitignore # git版控忽略的檔案
├── commitlint.config.js # 配置Commitlint工具的配置文件
├── index.html
├── package-lock.js 
├── package.json 
├── postcss.config.js # postcss配置設定檔
├── README.md
├── tailwind.config.js # tailwindcss配置設定檔，使用jit模式加速開發
└── vite.config.js # vite配置設定檔
```

## Git commit 規範說明

- `add` 新增檔案
- `delete` 刪除檔案
- `update` 變更程式碼/需求
- `feat` 新增程式碼/需求
- `fix` 修正issues/bugs
- `docs` 更新文件
- `style` 變更程式碼風格（不影響原執行結果/程式碼意義）
- `refactor` 重構程式碼
- `perf` 優化效能
- `test` 測試相關，不影響程式業務邏輯
- `chore` 更新依賴/調整架構配置
- `revert` 撤回commit
- `WIP` 進行中
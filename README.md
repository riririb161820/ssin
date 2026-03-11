# 상상인 마켓플레이스 — B2B 기자재 플랫폼

> Glassmorphism × Neo-Brutalism 디자인 시스템  
> Next.js 14 · Tailwind CSS · React 18

---

## 🚀 빠른 시작 (VSCode)

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

### 3. 브라우저 열기
```
http://localhost:3000
```

---

## 📁 프로젝트 구조

```
sangsangin-marketplace/
├── src/
│   ├── app/
│   │   ├── layout.tsx        ← HTML 루트 레이아웃
│   │   ├── page.tsx          ← 진입점 (App 컴포넌트 마운트)
│   │   └── globals.css       ← Tailwind + 글로벌 스타일
│   └── components/
│       └── App.tsx           ← 전체 앱 (3개 포털 통합)
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── next.config.js
```

---

## 🖥 포털 구성

상단 탭으로 3개 포털을 전환합니다.

| 탭 | 설명 |
|---|---|
| 🛒 **구매사** | 선박기자재 카탈로그 · 장바구니 · 여신결제 |
| 📦 **공급사** | 대시보드 · 선정산(Factoring) · 상품등록 |
| 🏛 **관리자** | Kanban 주문관리 · 여신심사 · 특별한도 승인 |

---

## ✨ 핵심 기능

### 구매사 (Front-end)
- 선박 기자재 카탈로그 (카테고리/검색 필터)
- 상품 상세: 수량 입력, 재고 표시, 견적서(RFQ) 다운로드
- **여신 한도 게이지** 실시간 표시
- **장바구니 → 여신결제** 원클릭 퍼널
- **복합결제 UI**: 여신 한도 부족 시 초과분 자동 카드 분리

### 공급사 (Seller Office)
- 매출/발주 대시보드 + 바 차트
- **선정산(Factoring)**: 세금계산서 리스트 → [땡겨받기] → 수수료/실수령액 확인 모달
- 엑셀 Bulk 업로드 UI + 단건 상품 등록 폼

### 관리자 (Back-Office)
- **Kanban 보드**: 결제대기 → 여신심사중 → 발주완료 → 배송중
- **Fallback 패널**: 한도 초과 VIP 주문 하이라이트
- **[특별 한도 1회 부여]** 강제 승인 모달 + 감사 로그

---

## 🔧 VSCode 추천 확장

```
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Prettier - Code formatter
```

---

## 📦 기술 스택

| 항목 | 버전 |
|---|---|
| Next.js | 14.2.3 |
| React | 18 |
| Tailwind CSS | 3.4 |
| TypeScript | 5 |

---

## 💡 Mock Data

`src/components/App.tsx` 상단의 `MOCK_PRODUCTS`, `MOCK_ORDERS`, `MOCK_INVOICES`, `CREDIT_LINE` 상수를 수정하면 됩니다.

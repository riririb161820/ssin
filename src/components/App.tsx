"use client";
import { useState } from "react";

// ============================================================
// MOCK DATA
// ============================================================
const MOCK_PRODUCTS = [
  { id: 1, name: "MAN B&W 6S60MC-C 메인 엔진", category: "선박엔진", price: 1250000000, stock: 3, leadDays: 45, certified: true, img: "🚢", specs: "6기통 / 출력: 13,560kW / RPM: 105", rating: 4.9, reviews: 12, brand: "MAN Energy Solutions" },
  { id: 2, name: "Wartsila RT-flex50 엔진 부품 세트", category: "엔진부품", price: 87500000, stock: 15, leadDays: 14, certified: true, img: "⚙️", specs: "피스톤링/실린더라이너/크랭크샤프트 포함", rating: 4.8, reviews: 34, brand: "Wärtsilä" },
  { id: 3, name: "ABB 터보차저 TPS61-F21", category: "터보차저", price: 32000000, stock: 8, leadDays: 21, certified: true, img: "🔧", specs: "지름: 610mm / 최대RPM: 18,500", rating: 4.7, reviews: 28, brand: "ABB Marine" },
  { id: 4, name: "Kongsberg K-Chief 700 통합관리시스템", category: "항법장비", price: 156000000, stock: 2, leadDays: 60, certified: true, img: "📡", specs: "ECDIS통합 / IMO인증 / 듀얼모니터", rating: 5.0, reviews: 7, brand: "Kongsberg Maritime" },
  { id: 5, name: "MHI 대형 프로펠러 (5엽)", category: "추진장치", price: 420000000, stock: 1, leadDays: 90, certified: false, img: "🌀", specs: "직경: 8.2m / 재질: 니켈알루미늄청동", rating: 4.6, reviews: 5, brand: "Mitsubishi Heavy" },
  { id: 6, name: "Alfa Laval 열교환기 M30-MFG", category: "보조기계", price: 18500000, stock: 22, leadDays: 7, certified: true, img: "🔩", specs: "전열면적: 340㎡ / 최대압력: 16bar", rating: 4.8, reviews: 41, brand: "Alfa Laval" },
];

const MOCK_ORDERS = [
  { id: "ORD-2025-0891", company: "한국해운㈜", product: "MAN B&W 6S60MC-C 메인 엔진", amount: 1250000000, status: "여신심사중", date: "2025-06-10", creditType: "여신결제", isVip: true, flagged: true },
  { id: "ORD-2025-0890", company: "대한조선㈜", product: "Wartsila RT-flex50 엔진 부품 세트", amount: 175000000, status: "발주완료", date: "2025-06-09", creditType: "여신결제", isVip: false, flagged: false },
  { id: "ORD-2025-0889", company: "삼성중공업㈜", product: "ABB 터보차저 TPS61-F21 x5", amount: 160000000, status: "배송중", date: "2025-06-08", creditType: "복합결제", isVip: true, flagged: false },
  { id: "ORD-2025-0888", company: "현대미포조선㈜", product: "Kongsberg K-Chief 700", amount: 156000000, status: "결제대기", date: "2025-06-11", creditType: "카드결제", isVip: false, flagged: false },
  { id: "ORD-2025-0887", company: "STX조선해양㈜", product: "Alfa Laval 열교환기 x3", amount: 55500000, status: "배송중", date: "2025-06-07", creditType: "여신결제", isVip: false, flagged: false },
  { id: "ORD-2025-0886", company: "한진중공업㈜", product: "MHI 대형 프로펠러 (5엽)", amount: 420000000, status: "결제대기", date: "2025-06-11", creditType: "여신결제", isVip: true, flagged: true },
];

const MOCK_INVOICES = [
  { id: "INV-2025-0341", buyer: "한국해운㈜", product: "엔진 부품 일괄", amount: 87500000, dueDate: "2025-07-09", status: "정산가능", fee: 0.015 },
  { id: "INV-2025-0340", buyer: "대한조선㈜", product: "터보차저 2기", amount: 64000000, dueDate: "2025-07-08", status: "정산가능", fee: 0.015 },
  { id: "INV-2025-0339", buyer: "현대미포조선㈜", product: "열교환기 부품", amount: 37000000, dueDate: "2025-07-01", status: "정산완료", fee: 0.015 },
  { id: "INV-2025-0338", buyer: "삼성중공업㈜", product: "항법장비 일체", amount: 156000000, dueDate: "2025-07-15", status: "정산가능", fee: 0.012 },
];

const CREDIT_LINE = { total: 2000000000, used: 1500000000, available: 500000000, company: "한국해운㈜" };

// ============================================================
// UTILS
// ============================================================
const fmt = (n) => new Intl.NumberFormat("ko-KR").format(n);
const fmtW = (n) => `₩${fmt(n)}`;

// ============================================================
// DESIGN TOKENS & ICONS
// ============================================================
const Icon = {
  Ship: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 17l9 3 9-3M12 2v8m0 0l-4-4m4 4l4-4M5 17l-2 2h18l-2-2"/></svg>,
  Cart: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 5h14M10 21a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2z"/></svg>,
  Bank: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 10v11M16 10v11M12 10v11"/></svg>,
  Dashboard: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  Package: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  Settings: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M4 12H2m20 0h-2M4.93 19.07l1.41-1.41M19.07 19.07l-1.41-1.41M12 20v2M12 2v2"/></svg>,
  Menu: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  Close: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Check: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  Alert: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Star: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Money: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  Truck: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="3" width="15" height="13" rx="1"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  Upload: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>,
  Filter: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  Shield: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  ChevronRight: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
  Plus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Minus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Kanban: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="5" height="18" rx="1"/><rect x="10" y="3" width="5" height="11" rx="1"/><rect x="17" y="3" width="5" height="14" rx="1"/></svg>,
  Bolt: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
};

// ============================================================
// SHARED COMPONENTS
// ============================================================
const Badge = ({ children, color = "teal" }) => {
  const colors = {
    teal: "bg-teal-500/20 text-teal-300 border-teal-500/30",
    blue: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    yellow: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    red: "bg-red-500/20 text-red-300 border-red-500/30",
    green: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    gray: "bg-slate-500/20 text-slate-300 border-slate-500/30",
    orange: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${colors[color]}`}>
      {children}
    </span>
  );
};

const GlassCard = ({ children, className = "", onClick, highlight }) => (
  <div
    onClick={onClick}
    className={`
      relative rounded-2xl border transition-all duration-300
      ${highlight ? "border-red-500/50 bg-red-950/20" : "border-white/10 bg-white/5"}
      backdrop-blur-md shadow-xl
      ${onClick ? "cursor-pointer hover:border-teal-500/40 hover:bg-white/8 hover:-translate-y-0.5" : ""}
      ${className}
    `}
  >
    {children}
  </div>
);

const StatusBadge = ({ status }) => {
  const map = {
    "결제대기": { color: "yellow", dot: "bg-yellow-400" },
    "여신심사중": { color: "blue", dot: "bg-blue-400 animate-pulse" },
    "발주완료": { color: "teal", dot: "bg-teal-400" },
    "배송중": { color: "green", dot: "bg-emerald-400" },
    "정산가능": { color: "teal", dot: "bg-teal-400" },
    "정산완료": { color: "gray", dot: "bg-slate-400" },
  };
  const { color, dot } = map[status] || { color: "gray", dot: "bg-slate-400" };
  return (
    <Badge color={color}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {status}
    </Badge>
  );
};

// ============================================================
// MODALS
// ============================================================
const Modal = ({ open, onClose, children, title }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl bg-slate-900 border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-white/10 sticky top-0 bg-slate-900 z-10">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
            <Icon.Close />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

const FactoringModal = ({ invoice, onClose }) => {
  if (!invoice) return null;
  const fee = Math.floor(invoice.amount * invoice.fee);
  const receive = invoice.amount - fee;
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 2000);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-teal-500/10 border border-teal-500/20 p-4">
        <div className="text-xs text-teal-400 font-semibold mb-1">세금계산서</div>
        <div className="text-white font-semibold">{invoice.id}</div>
        <div className="text-slate-400 text-sm">{invoice.buyer} · {invoice.product}</div>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between text-sm"><span className="text-slate-400">청구금액</span><span className="text-white font-semibold">{fmtW(invoice.amount)}</span></div>
        <div className="flex justify-between text-sm"><span className="text-slate-400">선정산 수수료 ({(invoice.fee * 100).toFixed(1)}%)</span><span className="text-red-400 font-semibold">-{fmtW(fee)}</span></div>
        <div className="h-px bg-white/10" />
        <div className="flex justify-between"><span className="text-white font-bold text-lg">실 수령액</span><span className="text-teal-400 font-black text-xl">{fmtW(receive)}</span></div>
      </div>
      <div className="rounded-xl bg-slate-800 p-3 text-xs text-slate-400">
        📌 영업일 기준 <strong className="text-white">1일 이내</strong> 지정 계좌로 입금됩니다. 상상인저축은행이 채권을 양수합니다.
      </div>
      {done ? (
        <div className="rounded-xl bg-emerald-500/20 border border-emerald-500/30 p-4 text-center">
          <div className="text-2xl mb-1">✅</div>
          <div className="text-emerald-400 font-bold">선정산 신청 완료!</div>
          <div className="text-slate-400 text-sm">{fmtW(receive)} 입금 처리 중</div>
        </div>
      ) : (
        <button onClick={handleConfirm} disabled={loading}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-black text-base hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />처리중...</> : "💸 지금 바로 받기"}
        </button>
      )}
    </div>
  );
};

const CreditApprovalModal = ({ order, onClose, onApprove }) => {
  if (!order) return null;
  const [done, setDone] = useState(false);
  const handleApprove = () => { setDone(true); setTimeout(() => { onApprove(order.id); onClose(); }, 1500); };
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4">
        <div className="flex items-center gap-2 text-red-400 font-bold mb-2"><Icon.Alert /> 한도 초과 주문</div>
        <div className="text-white font-semibold text-lg">{order.company}</div>
        <div className="text-slate-400 text-sm">{order.id} · {order.product}</div>
        <div className="text-white font-bold text-xl mt-2">{fmtW(order.amount)}</div>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between p-3 rounded-lg bg-slate-800"><span className="text-slate-400">현재 가용 여신</span><span className="text-white">₩300,000,000</span></div>
        <div className="flex justify-between p-3 rounded-lg bg-slate-800"><span className="text-slate-400">초과 금액</span><span className="text-red-400 font-bold">{fmtW(order.amount - 300000000)}</span></div>
        <div className="flex justify-between p-3 rounded-lg bg-teal-500/10 border border-teal-500/20"><span className="text-teal-400">1회 특별 한도 부여</span><span className="text-white font-bold">{fmtW(order.amount)}</span></div>
      </div>
      <div className="rounded-xl bg-slate-800 p-3 text-xs text-slate-400">
        ⚠️ 특별 한도는 <strong className="text-white">이번 주문에만</strong> 적용됩니다. 심사역 ID와 승인 사유가 로그에 기록됩니다.
      </div>
      {done ? (
        <div className="rounded-xl bg-emerald-500/20 border border-emerald-500/30 p-4 text-center">
          <div className="text-2xl mb-1">✅</div>
          <div className="text-emerald-400 font-bold">특별 한도 승인 완료</div>
        </div>
      ) : (
        <button onClick={handleApprove}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-black text-base hover:opacity-90 transition-all">
          ⚡ 특별 한도 1회 부여 · 강제 승인
        </button>
      )}
    </div>
  );
};

// ============================================================
// PART 1: FRONT-END (구매사)
// ============================================================

// 상품 카탈로그
const ProductCard = ({ product, onAddCart, onDetail }) => (
  <GlassCard onClick={() => onDetail(product)} className="overflow-hidden group">
    <div className="p-4 pb-3">
      <div className="flex items-start justify-between mb-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-teal-500/20 flex items-center justify-center text-2xl">
          {product.img}
        </div>
        <div className="flex flex-col items-end gap-1">
          {product.certified && (
            <Badge color="teal"><Icon.Shield /> 인증</Badge>
          )}
          <Badge color={product.stock <= 2 ? "red" : "gray"}>
            재고 {product.stock}
          </Badge>
        </div>
      </div>
      <div className="text-xs text-slate-500 mb-1">{product.category} · {product.brand}</div>
      <div className="text-white font-bold text-sm leading-tight mb-1 line-clamp-2">{product.name}</div>
      <div className="text-slate-500 text-xs mb-3 line-clamp-1">{product.specs}</div>
      <div className="flex items-center gap-1 mb-3">
        <span className="text-yellow-400"><Icon.Star /></span>
        <span className="text-white text-xs font-bold">{product.rating}</span>
        <span className="text-slate-500 text-xs">({product.reviews})</span>
        <span className="ml-auto text-slate-500 text-xs flex items-center gap-1">
          <Icon.Truck />{product.leadDays}일
        </span>
      </div>
      <div className="text-teal-400 font-black text-lg">{fmtW(product.price)}</div>
    </div>
    <div className="px-4 pb-4">
      <button
        onClick={(e) => { e.stopPropagation(); onAddCart(product); }}
        className="w-full py-2.5 rounded-xl bg-teal-500/20 border border-teal-500/30 text-teal-300 text-sm font-bold hover:bg-teal-500 hover:text-white transition-all flex items-center justify-center gap-2">
        <Icon.Cart /> 장바구니 담기
      </button>
    </div>
  </GlassCard>
);

const ProductDetail = ({ product, onClose, onAddCart }) => {
  const [qty, setQty] = useState(1);
  if (!product) return null;
  return (
    <div className="fixed inset-0 z-40 bg-slate-950 overflow-y-auto">
      <div className="max-w-2xl mx-auto p-4 pb-32">
        <button onClick={onClose} className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 mt-2 transition-colors">
          ← 목록으로
        </button>
        <div className="w-full aspect-video rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center text-6xl mb-4">
          {product.img}
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {product.certified && <Badge color="teal"><Icon.Shield /> 상상인 인증</Badge>}
          <Badge color="blue">{product.category}</Badge>
          <Badge color={product.stock <= 2 ? "red" : "gray"}>재고 {product.stock}개</Badge>
        </div>
        <h1 className="text-xl font-black text-white mb-1">{product.name}</h1>
        <div className="text-slate-400 text-sm mb-4">{product.brand} · {product.specs}</div>
        <div className="flex items-center gap-2 mb-6">
          <span className="text-yellow-400"><Icon.Star /></span>
          <span className="text-white font-bold">{product.rating}</span>
          <span className="text-slate-500 text-sm">({product.reviews}건 리뷰)</span>
        </div>

        <GlassCard className="p-4 mb-4">
          <div className="text-xs text-slate-500 mb-1">납기일</div>
          <div className="text-white font-bold flex items-center gap-2"><Icon.Truck /> 발주 후 {product.leadDays}일</div>
        </GlassCard>

        <GlassCard className="p-4 mb-4">
          <div className="text-slate-400 text-sm mb-3 font-semibold">수량 선택</div>
          <div className="flex items-center gap-4">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10"><Icon.Minus /></button>
            <span className="text-white font-black text-2xl w-12 text-center">{qty}</span>
            <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10"><Icon.Plus /></button>
            <span className="ml-auto text-teal-400 font-black text-xl">{fmtW(product.price * qty)}</span>
          </div>
        </GlassCard>

        <button className="w-full py-3 rounded-xl border border-teal-500/30 text-teal-300 font-bold text-sm hover:bg-teal-500/10 transition-all flex items-center justify-center gap-2 mb-2">
          📄 견적서(RFQ) 다운로드
        </button>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-950/95 backdrop-blur-xl border-t border-white/10 z-50">
        <div className="max-w-2xl mx-auto flex gap-3">
          <button onClick={() => { onAddCart({ ...product, qty }); onClose(); }}
            className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-black text-base hover:opacity-90 transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2">
            <Icon.Cart /> 장바구니 담기
          </button>
          <button className="flex-1 py-4 rounded-2xl bg-white text-slate-900 font-black text-base hover:opacity-90 transition-all flex items-center justify-center gap-2">
            ⚡ 바로 구매
          </button>
        </div>
      </div>
    </div>
  );
};

const CartCheckout = ({ cart, onBack, onClearCart }) => {
  const total = cart.reduce((s, i) => s + i.price * (i.qty || 1), 0);
  const creditAvailable = CREDIT_LINE.available;
  const creditUsed = Math.min(total, creditAvailable);
  const cardAmount = Math.max(0, total - creditAvailable);
  const isHybrid = cardAmount > 0;
  const [payMethod, setPayMethod] = useState("credit");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 2000);
  };

  if (done) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        <div className="text-6xl mb-4">🎉</div>
        <div className="text-white font-black text-2xl mb-2">주문 완료!</div>
        <div className="text-slate-400 mb-2">여신 결제 {fmtW(creditUsed)}</div>
        {isHybrid && <div className="text-slate-400 mb-4">카드 결제 {fmtW(cardAmount)}</div>}
        <div className="text-slate-500 text-sm mb-6">심사 후 담당자가 연락드립니다.</div>
        <button onClick={() => { onClearCart(); onBack(); }} className="px-6 py-3 rounded-xl bg-teal-500 text-white font-bold">홈으로</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 pb-40">
      <div className="max-w-2xl mx-auto p-4">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 mt-2 transition-colors">← 장바구니</button>
        <h2 className="text-xl font-black text-white mb-4">결제</h2>

        {/* Credit Line Card */}
        <GlassCard className="p-4 mb-4 border-teal-500/30">
          <div className="flex items-center gap-2 mb-3">
            <Icon.Bank />
            <span className="text-white font-bold text-sm">상상인저축은행 여신 한도</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400">총 한도</span>
            <span className="text-white">{fmtW(CREDIT_LINE.total)}</span>
          </div>
          <div className="flex justify-between text-sm mb-3">
            <span className="text-slate-400">사용 중</span>
            <span className="text-red-400">{fmtW(CREDIT_LINE.used)}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-800 mb-2 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-400 transition-all"
              style={{ width: `${(CREDIT_LINE.available / CREDIT_LINE.total) * 100}%` }} />
          </div>
          <div className="flex justify-between">
            <span className="text-teal-400 text-sm font-bold">가용 한도</span>
            <span className="text-teal-400 font-black text-lg">{fmtW(CREDIT_LINE.available)}</span>
          </div>
        </GlassCard>

        {/* Items */}
        <div className="space-y-2 mb-4">
          {cart.map(item => (
            <GlassCard key={item.id} className="p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-xl">{item.img}</div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-semibold truncate">{item.name}</div>
                <div className="text-slate-400 text-xs">수량 {item.qty || 1}</div>
              </div>
              <div className="text-teal-400 font-bold text-sm">{fmtW(item.price * (item.qty || 1))}</div>
            </GlassCard>
          ))}
        </div>

        {/* Payment method */}
        <GlassCard className="p-4 mb-4">
          <div className="text-white font-bold mb-3 text-sm">결제 수단</div>
          <div className="space-y-2">
            {[
              { val: "credit", label: "외상 결제 (B2B 여신)", sub: "상상인저축은행 여신 한도 사용", icon: "🏦" },
              { val: "card", label: "법인 카드 결제", sub: "일반 신용카드", icon: "💳" },
            ].map(m => (
              <button key={m.val} onClick={() => setPayMethod(m.val)}
                className={`w-full p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${payMethod === m.val ? "border-teal-500 bg-teal-500/10" : "border-white/10 bg-white/5 hover:border-white/20"}`}>
                <span className="text-xl">{m.icon}</span>
                <div className="flex-1">
                  <div className={`font-bold text-sm ${payMethod === m.val ? "text-teal-300" : "text-white"}`}>{m.label}</div>
                  <div className="text-slate-500 text-xs">{m.sub}</div>
                </div>
                {payMethod === m.val && <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center"><Icon.Check /></div>}
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Hybrid payment notice */}
        {isHybrid && payMethod === "credit" && (
          <GlassCard className="p-4 mb-4 border-yellow-500/30 bg-yellow-500/5">
            <div className="flex gap-2">
              <Icon.Alert />
              <div>
                <div className="text-yellow-400 font-bold text-sm mb-1">복합 결제 적용</div>
                <div className="text-slate-400 text-xs">여신 한도가 부족합니다. 부족분은 카드로 자동 분리 결제됩니다.</div>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-sm"><span className="text-slate-400">여신 결제</span><span className="text-teal-400 font-bold">{fmtW(creditUsed)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-400">카드 결제</span><span className="text-yellow-400 font-bold">{fmtW(cardAmount)}</span></div>
                </div>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Total */}
        <GlassCard className="p-4 mb-4">
          <div className="flex justify-between text-sm mb-2"><span className="text-slate-400">상품 합계</span><span className="text-white">{fmtW(total)}</span></div>
          <div className="flex justify-between text-sm mb-2"><span className="text-slate-400">배송비</span><span className="text-white">협의</span></div>
          <div className="h-px bg-white/10 my-3" />
          <div className="flex justify-between"><span className="text-white font-bold text-lg">총 결제금액</span><span className="text-teal-400 font-black text-xl">{fmtW(total)}</span></div>
        </GlassCard>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-950/95 backdrop-blur-xl border-t border-white/10 z-50">
        <div className="max-w-2xl mx-auto">
          <button onClick={handlePay} disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-black text-lg hover:opacity-90 transition-all shadow-lg shadow-teal-500/25 disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />결제 처리 중...</> : `${fmtW(total)} 결제하기`}
          </button>
          <div className="text-center text-slate-500 text-xs mt-2">🔒 256-bit SSL 암호화 · 상상인저축은행 보증</div>
        </div>
      </div>
    </div>
  );
};

const FrontendApp = () => {
  const [view, setView] = useState("catalog"); // catalog | detail | cart | checkout
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("전체");
  const categories = ["전체", "선박엔진", "엔진부품", "터보차저", "항법장비", "추진장치", "보조기계"];

  const filtered = MOCK_PRODUCTS.filter(p =>
    (category === "전체" || p.category === category) &&
    (search === "" || p.name.includes(search) || p.brand.includes(search))
  );

  const addCart = (product) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === product.id);
      if (ex) return prev.map(i => i.id === product.id ? { ...i, qty: (i.qty || 1) + 1 } : i);
      return [...prev, { ...product, qty: product.qty || 1 }];
    });
  };

  if (view === "detail" && selectedProduct) return <ProductDetail product={selectedProduct} onClose={() => setView("catalog")} onAddCart={addCart} />;
  if (view === "checkout") return <CartCheckout cart={cart} onBack={() => setView("cart")} onClearCart={() => setCart([])} />;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-sm font-black text-white">S</div>
            <div>
              <div className="text-white font-black text-sm leading-none">상상인</div>
              <div className="text-teal-400 text-xs leading-none">마켓플레이스</div>
            </div>
          </div>
          <div className="flex-1 relative">
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="상품, 부품, 브랜드 검색..."
              className="w-full py-2 pl-3 pr-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-teal-500/50" />
          </div>
          <button onClick={() => setView("cart")} className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">
            <Icon.Cart />
            {cart.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center font-bold">{cart.length}</span>}
          </button>
        </div>

        {/* Category tabs */}
        <div className="max-w-4xl mx-auto px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {categories.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${category === c ? "bg-teal-500 text-white" : "bg-white/5 border border-white/10 text-slate-400 hover:border-white/20 hover:text-white"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Credit banner */}
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="rounded-xl bg-gradient-to-r from-teal-900/50 to-cyan-900/30 border border-teal-500/20 p-3 flex items-center gap-3">
          <Icon.Bank />
          <div className="flex-1 min-w-0">
            <div className="text-teal-300 font-bold text-sm">상상인저축은행 여신 한도</div>
            <div className="text-slate-400 text-xs">{CREDIT_LINE.company} · 가용 {fmtW(CREDIT_LINE.available)}</div>
          </div>
          <div className="shrink-0">
            <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-400" style={{ width: "25%" }} />
            </div>
          </div>
        </div>
      </div>

      {view === "cart" ? (
        <div className="max-w-4xl mx-auto px-4 pb-40">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-black text-xl">장바구니 ({cart.length})</h2>
            <button onClick={() => setView("catalog")} className="text-slate-400 text-sm hover:text-white">← 계속 쇼핑</button>
          </div>
          {cart.length === 0 ? (
            <div className="text-center py-20 text-slate-600">
              <div className="text-5xl mb-4">🛒</div>
              <div className="text-lg font-bold text-slate-500">장바구니가 비어있습니다</div>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map(item => (
                <GlassCard key={item.id} className="p-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-2xl">{item.img}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-bold text-sm truncate">{item.name}</div>
                    <div className="text-slate-400 text-xs">{item.brand}</div>
                    <div className="text-teal-400 font-black">{fmtW(item.price)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setCart(c => c.map(i => i.id === item.id ? { ...i, qty: Math.max(1, (i.qty || 1) - 1) } : i))} className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10"><Icon.Minus /></button>
                    <span className="text-white font-bold w-4 text-center text-sm">{item.qty || 1}</span>
                    <button onClick={() => setCart(c => c.map(i => i.id === item.id ? { ...i, qty: (i.qty || 1) + 1 } : i))} className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10"><Icon.Plus /></button>
                  </div>
                  <button onClick={() => setCart(c => c.filter(i => i.id !== item.id))} className="p-1 text-slate-600 hover:text-red-400 transition-colors"><Icon.Close /></button>
                </GlassCard>
              ))}
            </div>
          )}
          {cart.length > 0 && (
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-950/95 backdrop-blur-xl border-t border-white/10 z-50">
              <div className="max-w-4xl mx-auto">
                <div className="flex justify-between mb-3">
                  <span className="text-slate-400">합계</span>
                  <span className="text-teal-400 font-black text-xl">{fmtW(cart.reduce((s, i) => s + i.price * (i.qty || 1), 0))}</span>
                </div>
                <button onClick={() => setView("checkout")} className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-black text-lg hover:opacity-90 transition-all shadow-lg shadow-teal-500/20">
                  ⚡ 여신 결제로 구매하기
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-4 pb-8">
          <div className="text-slate-500 text-xs mb-3">{filtered.length}개 상품</div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} onAddCart={addCart} onDetail={prod => { setSelectedProduct(prod); setView("detail"); }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// PART 2: SELLER OFFICE
// ============================================================
const SellerApp = () => {
  const [page, setPage] = useState("dashboard");
  const [factoringModal, setFactoringModal] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  const navItems = [
    { id: "dashboard", label: "대시보드", icon: Icon.Dashboard },
    { id: "factoring", label: "선정산", icon: Icon.Bank },
    { id: "products", label: "상품등록", icon: Icon.Package },
  ];

  const stats = [
    { label: "금월 매출", value: "₩1.23B", change: "+12.4%", up: true, icon: "💰" },
    { label: "발주 대기", value: "8건", change: "긴급 2건", up: false, icon: "📦" },
    { label: "정산 가능", value: "₩344M", change: "3건 가능", up: true, icon: "⚡" },
    { label: "등록 상품", value: "24개", change: "+3 신규", up: true, icon: "🔧" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar - desktop */}
      <div className="hidden md:flex w-56 flex-col border-r border-white/10 bg-slate-900/50 backdrop-blur-xl fixed h-full z-20">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-sm font-black text-white">S</div>
            <div>
              <div className="text-white font-black text-sm leading-none">Seller Office</div>
              <div className="text-teal-400 text-xs leading-none">상상인 마켓</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(n => (
            <button key={n.id} onClick={() => setPage(n.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${page === n.id ? "bg-teal-500/20 text-teal-300 border border-teal-500/30" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
              <n.icon />
              {n.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="text-slate-500 text-xs">㈜대한선박기계</div>
          <div className="text-slate-400 text-xs">seller@daehan.co.kr</div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-xs font-black text-white">S</div>
          <span className="text-white font-bold text-sm">Seller Office</span>
        </div>
        <button onClick={() => setMobileMenu(!mobileMenu)} className="p-2 rounded-xl bg-white/5 text-white">
          {mobileMenu ? <Icon.Close /> : <Icon.Menu />}
        </button>
      </div>
      {mobileMenu && (
        <div className="md:hidden fixed inset-0 z-20 bg-slate-900/98 backdrop-blur-xl pt-16 px-4">
          <nav className="space-y-2">
            {navItems.map(n => (
              <button key={n.id} onClick={() => { setPage(n.id); setMobileMenu(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all ${page === n.id ? "bg-teal-500/20 text-teal-300" : "text-slate-400"}`}>
                <n.icon />{n.label}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 md:ml-56 pt-16 md:pt-0">
        <div className="max-w-4xl mx-auto p-4 md:p-6">

          {page === "dashboard" && (
            <div className="space-y-4">
              <h1 className="text-xl font-black text-white">대시보드</h1>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3">
                {stats.map(s => (
                  <GlassCard key={s.label} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-2xl">{s.icon}</span>
                      <Badge color={s.up ? "teal" : "yellow"}>{s.change}</Badge>
                    </div>
                    <div className="text-2xl font-black text-white mb-0.5">{s.value}</div>
                    <div className="text-slate-500 text-xs">{s.label}</div>
                  </GlassCard>
                ))}
              </div>

              {/* Recent orders */}
              <GlassCard className="p-4">
                <div className="text-white font-bold mb-3">최근 발주</div>
                <div className="space-y-3">
                  {MOCK_ORDERS.slice(0, 4).map(o => (
                    <div key={o.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                      <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 text-xs font-bold shrink-0">
                        {o.company.slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-semibold truncate">{o.company}</div>
                        <div className="text-slate-500 text-xs truncate">{o.product}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-teal-400 text-sm font-bold">{fmtW(o.amount)}</div>
                        <StatusBadge status={o.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Revenue chart visual */}
              <GlassCard className="p-4">
                <div className="text-white font-bold mb-4">월별 매출 추이</div>
                <div className="flex items-end gap-1.5 h-24">
                  {[45, 62, 38, 78, 55, 90, 72, 85, 95, 68, 88, 100].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t-sm transition-all" style={{ height: `${h}%`, background: i === 11 ? "linear-gradient(to top, #14b8a6, #06b6d4)" : "rgba(148,163,184,0.15)" }} />
                  ))}
                </div>
                <div className="flex justify-between text-slate-600 text-xs mt-1">
                  <span>1월</span><span>6월</span><span>12월</span>
                </div>
              </GlassCard>
            </div>
          )}

          {page === "factoring" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-black text-white">선정산 (Factoring)</h1>
                <Badge color="blue">상상인저축은행</Badge>
              </div>

              <GlassCard className="p-4 border-teal-500/30 bg-gradient-to-r from-teal-900/20 to-cyan-900/10">
                <div className="text-teal-400 font-bold text-sm mb-1">💡 선정산이란?</div>
                <div className="text-slate-400 text-xs leading-relaxed">납품 완료된 세금계산서를 상상인저축은행에 양도하고, 만기일 이전에 대금을 즉시 수령하는 서비스입니다.</div>
              </GlassCard>

              <div className="space-y-3">
                {MOCK_INVOICES.map(inv => (
                  <GlassCard key={inv.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-white font-bold text-sm">{inv.id}</div>
                        <div className="text-slate-500 text-xs">{inv.buyer} · {inv.product}</div>
                      </div>
                      <StatusBadge status={inv.status} />
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-teal-400 font-black text-xl">{fmtW(inv.amount)}</div>
                        <div className="text-slate-500 text-xs">만기 {inv.dueDate}</div>
                      </div>
                      {inv.status === "정산가능" && (
                        <button onClick={() => setFactoringModal(inv)}
                          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-teal-500/20 flex items-center gap-1.5">
                          <Icon.Bolt />땡겨받기
                        </button>
                      )}
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {page === "products" && (
            <div className="space-y-4">
              <h1 className="text-xl font-black text-white">상품 등록</h1>

              {/* Bulk upload */}
              <GlassCard className="p-4">
                <div className="text-white font-bold mb-3">📊 엑셀 대량 업로드</div>
                <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-teal-500/40 transition-colors cursor-pointer">
                  <Icon.Upload />
                  <div className="text-slate-400 text-sm mt-2">Excel 파일을 드래그하거나 클릭하여 업로드</div>
                  <div className="text-slate-600 text-xs mt-1">.xlsx, .csv 지원 · 최대 1,000개 상품</div>
                  <button className="mt-3 px-4 py-2 rounded-xl bg-teal-500/20 border border-teal-500/30 text-teal-300 text-sm font-bold hover:bg-teal-500 hover:text-white transition-all">
                    파일 선택
                  </button>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 py-2 rounded-xl border border-white/10 text-slate-400 text-xs hover:text-white transition-colors">
                    📄 양식 다운로드
                  </button>
                  <button className="flex-1 py-2 rounded-xl border border-white/10 text-slate-400 text-xs hover:text-white transition-colors">
                    📋 업로드 가이드
                  </button>
                </div>
              </GlassCard>

              {/* Manual form */}
              <GlassCard className="p-4">
                <div className="text-white font-bold mb-4">✏️ 단일 상품 등록</div>
                <div className="space-y-3">
                  {[
                    { label: "상품명 *", placeholder: "예: MAN B&W 6S60MC-C 메인 엔진" },
                    { label: "브랜드 *", placeholder: "예: MAN Energy Solutions" },
                    { label: "HS Code", placeholder: "예: 8408.10.0000" },
                    { label: "단가 (원) *", placeholder: "예: 1,250,000,000" },
                  ].map(f => (
                    <div key={f.label}>
                      <label className="text-slate-400 text-xs mb-1 block">{f.label}</label>
                      <input placeholder={f.placeholder}
                        className="w-full py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-teal-500/50" />
                    </div>
                  ))}
                  <div>
                    <label className="text-slate-400 text-xs mb-1 block">카테고리 *</label>
                    <select className="w-full py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-teal-500/50 bg-slate-800">
                      {["선박엔진", "엔진부품", "터보차저", "항법장비", "추진장치", "보조기계"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs mb-1 block">상세 스펙</label>
                    <textarea rows={3} placeholder="기술 사양, 인증 정보 등"
                      className="w-full py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-teal-500/50 resize-none" />
                  </div>
                  <button className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold hover:opacity-90 transition-all">
                    상품 등록 신청
                  </button>
                </div>
              </GlassCard>
            </div>
          )}
        </div>
      </div>

      <Modal open={!!factoringModal} onClose={() => setFactoringModal(null)} title="선정산 신청 · 상상인저축은행">
        <FactoringModal invoice={factoringModal} onClose={() => setFactoringModal(null)} />
      </Modal>
    </div>
  );
};

// ============================================================
// PART 3: BACK-OFFICE (관리자)
// ============================================================
const AdminApp = () => {
  const [page, setPage] = useState("kanban");
  const [approvalModal, setApprovalModal] = useState(null);
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [mobileMenu, setMobileMenu] = useState(false);

  const kanbanCols = ["결제대기", "여신심사중", "발주완료", "배송중"];
  const colColors = {
    "결제대기": "border-yellow-500/30 bg-yellow-500/5",
    "여신심사중": "border-blue-500/30 bg-blue-500/5",
    "발주완료": "border-teal-500/30 bg-teal-500/5",
    "배송중": "border-emerald-500/30 bg-emerald-500/5",
  };

  const handleApprove = (orderId) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "발주완료", flagged: false } : o));
  };

  const navItems = [
    { id: "kanban", label: "주문 관리", icon: Icon.Kanban },
    { id: "credit", label: "여신 심사", icon: Icon.Bank },
    { id: "analytics", label: "통계", icon: Icon.Dashboard },
  ];

  const flaggedOrders = orders.filter(o => o.flagged);

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar desktop */}
      <div className="hidden md:flex w-56 flex-col border-r border-white/10 bg-slate-900/50 backdrop-blur-xl fixed h-full z-20">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-sm font-black text-white">A</div>
            <div>
              <div className="text-white font-black text-sm leading-none">Back-Office</div>
              <div className="text-red-400 text-xs leading-none">관리자 전용</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(n => (
            <button key={n.id} onClick={() => setPage(n.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${page === n.id ? "bg-red-500/20 text-red-300 border border-red-500/30" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
              <n.icon />{n.label}
              {n.id === "credit" && flaggedOrders.length > 0 && (
                <span className="ml-auto w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">{flaggedOrders.length}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="text-slate-500 text-xs">심사역 김상상</div>
          <div className="text-red-400 text-xs">Admin · 상상인그룹</div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-xs font-black text-white">A</div>
          <span className="text-white font-bold text-sm">Back-Office</span>
        </div>
        <button onClick={() => setMobileMenu(!mobileMenu)} className="p-2 rounded-xl bg-white/5 text-white">
          {mobileMenu ? <Icon.Close /> : <Icon.Menu />}
        </button>
      </div>
      {mobileMenu && (
        <div className="md:hidden fixed inset-0 z-20 bg-slate-900/98 backdrop-blur-xl pt-16 px-4">
          <nav className="space-y-2">
            {navItems.map(n => (
              <button key={n.id} onClick={() => { setPage(n.id); setMobileMenu(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold ${page === n.id ? "bg-red-500/20 text-red-300" : "text-slate-400"}`}>
                <n.icon />{n.label}
                {n.id === "credit" && flaggedOrders.length > 0 && <span className="ml-auto w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">{flaggedOrders.length}</span>}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 md:ml-56 pt-16 md:pt-0">
        <div className="p-4 md:p-6">

          {page === "kanban" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-black text-white">주문 관리</h1>
                <div className="flex gap-2">
                  <Badge color="gray">{orders.length}건</Badge>
                  {flaggedOrders.length > 0 && <Badge color="red">⚠️ 주의 {flaggedOrders.length}</Badge>}
                </div>
              </div>

              {/* Mobile: list view */}
              <div className="md:hidden space-y-3">
                {orders.map(o => (
                  <GlassCard key={o.id} highlight={o.flagged} className="p-4">
                    {o.flagged && (
                      <div className="flex items-center gap-1.5 text-red-400 text-xs font-bold mb-2">
                        <Icon.Alert />한도 초과 · 수동 심사 필요
                      </div>
                    )}
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="text-white font-bold text-sm">{o.id}</div>
                        <div className="text-slate-400 text-xs">{o.company}</div>
                      </div>
                      <StatusBadge status={o.status} />
                    </div>
                    <div className="text-slate-400 text-xs truncate mb-2">{o.product}</div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-teal-400 font-black">{fmtW(o.amount)}</div>
                        <Badge color={o.creditType === "여신결제" ? "blue" : o.creditType === "복합결제" ? "yellow" : "gray"}>{o.creditType}</Badge>
                      </div>
                      {o.flagged && (
                        <button onClick={() => setApprovalModal(o)}
                          className="px-3 py-2 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-xs hover:opacity-90 transition-all flex items-center gap-1">
                          <Icon.Bolt />특별 승인
                        </button>
                      )}
                    </div>
                  </GlassCard>
                ))}
              </div>

              {/* Desktop: Kanban */}
              <div className="hidden md:grid grid-cols-4 gap-4">
                {kanbanCols.map(col => (
                  <div key={col} className={`rounded-2xl border p-3 ${colColors[col]}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white font-bold text-sm">{col}</span>
                      <Badge color="gray">{orders.filter(o => o.status === col).length}</Badge>
                    </div>
                    <div className="space-y-2">
                      {orders.filter(o => o.status === col).map(o => (
                        <div key={o.id} className={`rounded-xl p-3 border transition-all cursor-pointer hover:-translate-y-0.5 ${o.flagged ? "border-red-500/40 bg-red-950/30" : "border-white/10 bg-white/5"}`}>
                          {o.flagged && <div className="flex items-center gap-1 text-red-400 text-xs font-bold mb-1"><Icon.Alert />한도 초과</div>}
                          <div className="text-white font-bold text-xs mb-0.5">{o.id}</div>
                          <div className="text-slate-400 text-xs mb-1">{o.company}</div>
                          <div className="text-slate-500 text-xs mb-2 truncate">{o.product}</div>
                          <div className="flex items-center justify-between">
                            <span className="text-teal-400 font-bold text-xs">{fmtW(o.amount)}</span>
                            {o.isVip && <Badge color="yellow">VIP</Badge>}
                          </div>
                          {o.flagged && (
                            <button onClick={() => setApprovalModal(o)}
                              className="w-full mt-2 py-1.5 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-xs hover:opacity-90 transition-all flex items-center justify-center gap-1">
                              <Icon.Bolt />특별 한도 부여
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {page === "credit" && (
            <div className="space-y-4">
              <h1 className="text-xl font-black text-white">여신 심사 · Fallback 관리</h1>

              {flaggedOrders.length > 0 && (
                <GlassCard className="p-4 border-red-500/30 bg-red-950/20">
                  <div className="flex items-center gap-2 text-red-400 font-bold mb-3">
                    <Icon.Alert /> 수동 심사 필요 ({flaggedOrders.length}건)
                  </div>
                  <div className="space-y-3">
                    {flaggedOrders.map(o => (
                      <div key={o.id} className="rounded-xl bg-red-950/30 border border-red-500/20 p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-bold text-sm">{o.company}</span>
                              {o.isVip && <Badge color="yellow">VIP</Badge>}
                            </div>
                            <div className="text-slate-500 text-xs">{o.id} · {o.date}</div>
                          </div>
                          <div className="text-red-400 font-black">{fmtW(o.amount)}</div>
                        </div>
                        <div className="text-slate-400 text-xs mb-3 truncate">{o.product}</div>
                        <div className="flex gap-2">
                          <button onClick={() => setApprovalModal(o)}
                            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-1.5">
                            <Icon.Bolt />특별 한도 1회 부여
                          </button>
                          <button className="px-4 py-2.5 rounded-xl border border-white/10 text-slate-400 text-sm hover:text-white transition-colors">
                            반려
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}

              <GlassCard className="p-4">
                <div className="text-white font-bold mb-3">전체 여신 현황</div>
                <div className="space-y-3">
                  {[
                    { company: "한국해운㈜", total: 2000000000, used: 1700000000, grade: "A+" },
                    { company: "삼성중공업㈜", total: 5000000000, used: 2100000000, grade: "AA" },
                    { company: "현대미포조선㈜", total: 3000000000, used: 1800000000, grade: "A" },
                    { company: "STX조선해양㈜", total: 1000000000, used: 600000000, grade: "BBB" },
                  ].map(c => (
                    <div key={c.company} className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold text-sm">{c.company}</span>
                          <Badge color={c.grade.startsWith("A") ? "teal" : "yellow"}>{c.grade}</Badge>
                        </div>
                        <span className="text-slate-400 text-xs">{Math.round((c.used / c.total) * 100)}% 사용</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${(c.used / c.total) > 0.85 ? "bg-gradient-to-r from-red-500 to-orange-400" : "bg-gradient-to-r from-teal-500 to-cyan-400"}`}
                          style={{ width: `${(c.used / c.total) * 100}%` }} />
                      </div>
                      <div className="flex justify-between text-xs mt-1">
                        <span className="text-slate-500">사용 {fmtW(c.used)}</span>
                        <span className="text-slate-500">한도 {fmtW(c.total)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          )}

          {page === "analytics" && (
            <div className="space-y-4">
              <h1 className="text-xl font-black text-white">통계</h1>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "총 거래액 (YTD)", value: "₩28.4B", icon: "📈" },
                  { label: "여신 결제 비율", value: "73.2%", icon: "🏦" },
                  { label: "선정산 실행액", value: "₩4.2B", icon: "⚡" },
                  { label: "평균 승인 시간", value: "2.3분", icon: "⏱" },
                ].map(s => (
                  <GlassCard key={s.label} className="p-4">
                    <div className="text-2xl mb-2">{s.icon}</div>
                    <div className="text-2xl font-black text-white mb-0.5">{s.value}</div>
                    <div className="text-slate-500 text-xs">{s.label}</div>
                  </GlassCard>
                ))}
              </div>

              <GlassCard className="p-4">
                <div className="text-white font-bold mb-4">결제 수단별 비율</div>
                <div className="space-y-3">
                  {[
                    { label: "B2B 여신 결제", pct: 73, color: "from-teal-500 to-cyan-400" },
                    { label: "복합 결제 (여신+카드)", pct: 18, color: "from-blue-500 to-indigo-400" },
                    { label: "법인 카드", pct: 9, color: "from-slate-500 to-slate-400" },
                  ].map(p => (
                    <div key={p.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">{p.label}</span>
                        <span className="text-white font-bold">{p.pct}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div className={`h-full rounded-full bg-gradient-to-r ${p.color}`} style={{ width: `${p.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          )}
        </div>
      </div>

      <Modal open={!!approvalModal} onClose={() => setApprovalModal(null)} title="특별 한도 부여 · 강제 승인">
        <CreditApprovalModal order={approvalModal} onClose={() => setApprovalModal(null)} onApprove={handleApprove} />
      </Modal>
    </div>
  );
};

// ============================================================
// ROOT APP — TAB SWITCHER
// ============================================================
export default function App() {
  const [portal, setPortal] = useState("front");

  const tabs = [
    { id: "front", label: "🛒 구매사", sub: "마켓플레이스" },
    { id: "seller", label: "📦 공급사", sub: "Seller Office" },
    { id: "admin", label: "🏛 관리자", sub: "Back-Office" },
    { id: "proposal", label: "📋 제안", sub: "Proposal" }
  ];

  const handleTabClick = (tabId) => {
    if (tabId === "proposal") {
      // 제안 탭일 경우: 기존 화면 유지한 채 새 창으로 HTML 페이지 띄우기
      window.open("https://ssin-ten.vercel.app/proposal_v2.html", "_blank", "noopener,noreferrer");
    } else {
      // 나머지 탭일 경우: 부드러운 React 내부 화면 전환
      setPortal(tabId);
    }
  };


  return (
    <div className="font-sans" style={{ fontFamily: "'DM Sans', 'Pretendard', system-ui, sans-serif" }}>
      {/* Portal switcher */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-2 px-2">
        <div className="flex gap-1 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-1 shadow-2xl">
          {tabs.map(t => (
            // 3. onClick 이벤트를 직접 변경하지 않고, 방금 만든 분기 함수로 연결
            <button key={t.id} onClick={() => handleTabClick(t.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center leading-tight ${portal === t.id ? "bg-white text-slate-900 shadow-lg" : "text-slate-400 hover:text-white"}`}>
              <span>{t.label}</span>
              <span className={`text-xs font-normal ${portal === t.id ? "text-slate-500" : "text-slate-600"}`}>{t.sub}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="pt-14">
        {portal === "front" && <FrontendApp />}
        {portal === "seller" && <SellerApp />}
        {portal === "admin" && <AdminApp />}
      </div>
    </div>
  );
}

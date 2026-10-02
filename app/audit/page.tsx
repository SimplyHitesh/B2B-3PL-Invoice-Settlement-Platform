"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  FileCheck2,
  AlertOctagon,
  Archive,
  Settings,
  Receipt,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  CheckCircle2,
  XCircle,
  Truck,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Smartphone,
  LayoutDashboard,
  Filter,
  ArrowRight,
  Building,
  MapPin,
  Calendar,
  Layers,
  Scale,
  DollarSign,
  AlertTriangle,
  RefreshCw,
  Send,
  Eye,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock Audit Trip Data
interface AuditTripItem {
  id: string;
  invoiceNo: string;
  lrNumber: string;
  regNo: string;
  driverName: string;
  driverPhone: string;
  clientName: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  systemGpsDistance: number;
  odometerDistance: number;
  // Financials
  expectedCod: number;
  reportedCod: number;
  tripAdvance: number;
  reportedExpenses: {
    toll: number;
    fuel: number;
    allowance: number;
  };
  systemAllowedExpenses: {
    toll: number;
    fuel: number;
    allowance: number;
  };
  signatory: {
    name: string;
    designation: string;
    signedAt: string;
  };
  status: "Pending" | "Flagged" | "Verified";
}

const MOCK_AUDIT_QUEUE: AuditTripItem[] = [
  {
    id: "TRIP-8842",
    invoiceNo: "INV-2026-9921",
    lrNumber: "LR-BLR-8842",
    regNo: "KA 01 AJ 3319",
    driverName: "Manjunath S.",
    driverPhone: "+91 94481 02931",
    clientName: "Metro Cash & Carry India",
    origin: "Hosur DC (Tamil Nadu)",
    destination: "Whitefield Regional DC, Bengaluru",
    departureTime: "02-Oct-2026 06:30 IST",
    arrivalTime: "02-Oct-2026 13:45 IST",
    systemGpsDistance: 132,
    odometerDistance: 130,
    expectedCod: 24500,
    reportedCod: 24500,
    tripAdvance: 6000,
    reportedExpenses: {
      toll: 850,
      fuel: 2200,
      allowance: 800,
    },
    systemAllowedExpenses: {
      toll: 850,
      fuel: 2150,
      allowance: 800,
    },
    signatory: {
      name: "K. Ramesh",
      designation: "Warehouse In-Charge, Bay #4",
      signedAt: "02-Oct-2026 13:50 IST",
    },
    status: "Pending",
  },
  {
    id: "TRIP-8841",
    invoiceNo: "INV-2026-8819",
    lrNumber: "LR-BHI-4402",
    regNo: "MH 12 RN 4920",
    driverName: "Rajesh Kumar",
    driverPhone: "+91 98231 44021",
    clientName: "Tata Motors Commercial Parts",
    origin: "Bhiwandi Hub #4, MH",
    destination: "Sanand Industrial Park, GJ",
    departureTime: "01-Oct-2026 18:00 IST",
    arrivalTime: "02-Oct-2026 11:20 IST",
    systemGpsDistance: 512,
    odometerDistance: 510,
    expectedCod: 48500,
    reportedCod: 46000, // Discrepancy
    tripAdvance: 12000,
    reportedExpenses: {
      toll: 2850,
      fuel: 4200,
      allowance: 1500,
    },
    systemAllowedExpenses: {
      toll: 2850,
      fuel: 3900,
      allowance: 1200,
    },
    signatory: {
      name: "Sunil Verma",
      designation: "Dock Supervisor",
      signedAt: "02-Oct-2026 11:35 IST",
    },
    status: "Flagged",
  },
  {
    id: "TRIP-8846",
    invoiceNo: "INV-2026-7731",
    lrNumber: "LR-CHN-1109",
    regNo: "TN 22 BQ 4109",
    driverName: "Murugan Selvam",
    driverPhone: "+91 97890 31284",
    clientName: "Coimbatore Textile Spares Ltd",
    origin: "Ennore Port Container Terminal",
    destination: "Coimbatore ICD, TN",
    departureTime: "01-Oct-2026 21:00 IST",
    arrivalTime: "02-Oct-2026 12:15 IST",
    systemGpsDistance: 490,
    odometerDistance: 490,
    expectedCod: 41000,
    reportedCod: 41000,
    tripAdvance: 11000,
    reportedExpenses: {
      toll: 1950,
      fuel: 3600,
      allowance: 1200,
    },
    systemAllowedExpenses: {
      toll: 1950,
      fuel: 3600,
      allowance: 1200,
    },
    signatory: {
      name: "P. Murugesan",
      designation: "Security & Materials Receiving",
      signedAt: "02-Oct-2026 12:30 IST",
    },
    status: "Pending",
  },
];

export default function InternalAuditWorkspace() {
  const [activeMenu, setActiveMenu] = useState("Audit Queue");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTripId, setSelectedTripId] = useState<string>("TRIP-8842");

  // Document Viewer Controls State
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);

  // Verification Checklist State
  const [checklist, setChecklist] = useState({
    distanceMatch: true,
    cashMatch: true,
    signaturePresent: true,
    consigneeStamp: true,
    podQualityReadable: true,
  });

  // Discrepancy Dialog Modal State
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [discrepancyReason, setDiscrepancyReason] = useState(
    "Cash collected has a deficit of ₹2,500 against the expected billing invoice. Fuel expense receipt missing official pump slip."
  );

  // Selected Trip Lookup
  const activeTrip = useMemo(() => {
    return (
      MOCK_AUDIT_QUEUE.find((t) => t.id === selectedTripId) ||
      MOCK_AUDIT_QUEUE[0]
    );
  }, [selectedTripId]);

  // Document Controls
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  const handleResetDoc = () => {
    setZoomLevel(1);
    setRotation(0);
  };

  // Toggle Checklist item
  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Financial calculations
  const totalReportedExp =
    activeTrip.reportedExpenses.toll +
    activeTrip.reportedExpenses.fuel +
    activeTrip.reportedExpenses.allowance;
  const totalAllowedExp =
    activeTrip.systemAllowedExpenses.toll +
    activeTrip.systemAllowedExpenses.fuel +
    activeTrip.systemAllowedExpenses.allowance;
  const expenseVariance = totalReportedExp - totalAllowedExp;
  const cashDeficit = activeTrip.reportedCod - activeTrip.expectedCod;

  // Actions
  const handleVerifyAndApprove = () => {
    alert(
      `✓ APPROVED: ${activeTrip.id} (${activeTrip.invoiceNo}) verified by Internal Audit!\nVoucher sent to Accounts Payable & Automated Billing Batch #289.`
    );
  };

  const handleConfirmDiscrepancy = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `⚠ DISCREPANCY LOGGED for ${activeTrip.id}!\nReason: ${discrepancyReason}\nTrip marked as FLAGGED and reassigned to Dispatch Dispute Desk.`
    );
    setIsDisputeModalOpen(false);
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-800 font-sans antialiased overflow-hidden">
      {/* 1. LEFT SIDEBAR (Brand-Consistent with Dispatch) */}
      <aside className="w-64 flex-shrink-0 flex flex-col border-r border-slate-200 bg-white">
        {/* Brand / Logo */}
        <div className="h-14 border-b border-slate-200 px-5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="h-7 w-7 rounded-md bg-slate-900 flex items-center justify-center text-white font-bold text-xs shadow-xs">
              <Truck className="h-4 w-4" />
            </div>
            <div>
              <span className="font-semibold text-sm tracking-tight text-slate-900 block leading-tight">
                VECTO LOGISTICS
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-600 block">
                AUDIT & SETTLEMENT
              </span>
            </div>
          </div>
        </div>

        {/* Role Identity Tag */}
        <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-indigo-100" />
              <span className="text-xs font-medium text-slate-700">
                Internal Audit Workspace
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-600">AUD-L2</span>
          </div>
          <p className="text-[11px] text-slate-600 mt-1 truncate">
            POD Settlement & Variance Desk
          </p>
        </div>

        {/* Navigation Menu */}
        <nav className="px-3 py-4 space-y-1">
          {[
            { name: "Audit Queue", icon: FileCheck2, badge: "45" },
            { name: "Dispute Resolutions", icon: AlertOctagon, badge: "12" },
            { name: "Archived Trips", icon: Archive, badge: null },
            { name: "Settings", icon: Settings, badge: null },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setActiveMenu(item.name)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-500"}`}
                />
                <span>{item.name}</span>
                {item.badge && (
                  <span
                    className={`ml-auto text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                      isActive
                        ? "bg-slate-800 text-slate-200"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Queue Selector Quick Strip */}
        <div className="px-3 py-2 border-t border-slate-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 px-1 mb-1.5 block">
            Active Review Queue
          </span>
          <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
            {MOCK_AUDIT_QUEUE.map((trip) => (
              <button
                key={trip.id}
                onClick={() => setSelectedTripId(trip.id)}
                className={`w-full text-left p-2 rounded-md border text-xs transition-all ${
                  selectedTripId === trip.id
                    ? "bg-slate-100 border-slate-400 font-semibold text-slate-900"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-slate-800">
                    {trip.id}
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-[9px] px-1 py-0 ${
                      trip.status === "Flagged"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {trip.status}
                  </Badge>
                </div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">
                  {trip.clientName}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Role Navigation Links */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/50 mt-auto">
          <div className="space-y-1.5">
            <Link
              href="/"
              className="flex items-center justify-between text-xs text-slate-600 hover:text-slate-900 p-1.5 rounded hover:bg-slate-100 transition-colors"
            >
              <span className="flex items-center gap-1.5 font-medium">
                <LayoutDashboard className="h-3.5 w-3.5 text-slate-500" />
                Dispatch Dashboard
              </span>
              <ExternalLink className="h-3 w-3 text-slate-400" />
            </Link>
            <Link
              href="/accounts"
              className="flex items-center justify-between text-xs text-slate-600 hover:text-slate-900 p-1.5 rounded hover:bg-slate-100 transition-colors"
            >
              <span className="flex items-center gap-1.5 font-medium">
                <Receipt className="h-3.5 w-3.5 text-emerald-600" />
                Accounts & Billing
              </span>
              <ExternalLink className="h-3 w-3 text-slate-400" />
            </Link>
            <Link
              href="/driver"
              className="flex items-center justify-between text-xs text-slate-600 hover:text-slate-900 p-1.5 rounded hover:bg-slate-100 transition-colors"
            >
              <span className="flex items-center gap-1.5 font-medium">
                <Smartphone className="h-3.5 w-3.5 text-blue-600" />
                Driver Mobile App
              </span>
              <ExternalLink className="h-3 w-3 text-slate-400" />
            </Link>
          </div>
        </div>
      </aside>

      {/* RIGHT MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* 2. TOP HEADER */}
        <header className="h-14 border-b border-slate-200 bg-white px-6 flex items-center justify-between gap-4 flex-shrink-0">
          {/* Search bar */}
          <div className="relative w-80">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search Trip ID, Invoice, Driver, LR No..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 text-xs bg-slate-50/50 border-slate-200 focus-visible:bg-white"
            />
          </div>

          {/* Metric Pill & Review Quick Status */}
          <div className="flex items-center space-x-3">
            <Badge
              variant="outline"
              className="bg-slate-50 border-slate-200 text-slate-700 font-mono text-xs px-2.5 py-1 flex items-center gap-1.5"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="font-semibold text-slate-900">45 Pending Audits</span>
              <span className="text-slate-300">|</span>
              <span className="text-red-600 font-semibold">12 Flagged</span>
            </Badge>

            <span className="text-xs text-slate-500 font-mono">
              Audit SLA: Under 2h
            </span>
          </div>
        </header>

        {/* 3. MAIN CONTENT: SPLIT-PANE DOCUMENT REVIEW LAYOUT (50/50) */}
        <div className="flex-1 grid grid-cols-12 overflow-hidden">
          
          {/* ========================================================================= */}
          {/* LEFT PANE: VISUAL PROOF (THE DOCUMENT VIEWER) - 6 Cols (50%) */}
          {/* ========================================================================= */}
          <section className="col-span-6 border-r border-slate-200 bg-slate-100 flex flex-col h-full overflow-hidden">
            {/* Document Viewer Toolbar */}
            <div className="h-11 px-4 border-b border-slate-200 bg-white flex items-center justify-between flex-shrink-0">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5 text-slate-600" />
                  Proof of Delivery: <span className="font-mono text-blue-700">{activeTrip.lrNumber}</span>
                </span>
                <span className="text-[11px] text-slate-600 font-mono">
                  ({Math.round(zoomLevel * 100)}% • {rotation}°)
                </span>
              </div>

              {/* Document Controls */}
              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomIn}
                  className="h-7 w-7 p-0 border-slate-200 text-slate-700 hover:bg-slate-100"
                  title="Zoom In"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomOut}
                  className="h-7 w-7 p-0 border-slate-200 text-slate-700 hover:bg-slate-100"
                  title="Zoom Out"
                  disabled={zoomLevel <= 0.75}
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRotate}
                  className="h-7 w-7 p-0 border-slate-200 text-slate-700 hover:bg-slate-100"
                  title="Rotate 90°"
                >
                  <RotateCw className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetDoc}
                  className="h-7 px-2 text-[10px] font-mono border-slate-200 text-slate-700 hover:bg-slate-100"
                  title="Reset View"
                >
                  Reset
                </Button>
              </div>
            </div>

            {/* Document Canvas Area */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-200/70">
              <div
                style={{
                  transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                  transition: "transform 0.15s ease-out",
                  transformOrigin: "center center",
                }}
                className="w-[430px] bg-white rounded-md shadow-md border border-slate-300 p-6 text-slate-800 text-[11px] select-none"
              >
                {/* Simulated Physical Lorry Receipt Header */}
                <div className="border-b-2 border-slate-900 pb-3 mb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-sm text-slate-900 tracking-wider">
                        VECTO 3PL CARRIERS LTD.
                      </h4>
                      <p className="text-[9px] text-slate-500 uppercase font-mono">
                        Consignment Note / Lorry Receipt (Consignee Copy)
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-xs block text-slate-900">
                        {activeTrip.lrNumber}
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono">
                        Date: 02-Oct-2026
                      </span>
                    </div>
                  </div>
                </div>

                {/* LR Grid Data */}
                <div className="grid grid-cols-2 gap-2 border border-slate-300 p-2.5 rounded bg-slate-50/50 mb-3">
                  <div>
                    <span className="text-[9px] text-slate-600 block uppercase font-bold">
                      Consignor (Sender)
                    </span>
                    <span className="font-bold text-slate-800 block truncate">
                      Vecto DC - Hub #4
                    </span>
                    <span className="text-[10px] text-slate-600">{activeTrip.origin}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-600 block uppercase font-bold">
                      Consignee (Receiver)
                    </span>
                    <span className="font-bold text-slate-800 block truncate">
                      {activeTrip.clientName}
                    </span>
                    <span className="text-[10px] text-slate-600">
                      {activeTrip.destination}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 border border-slate-300 p-2 rounded bg-slate-50/50 text-[10px] font-mono mb-3">
                  <div>
                    <span className="text-[9px] text-slate-600 block uppercase font-bold">
                      Truck No
                    </span>
                    <span className="font-bold text-slate-900">{activeTrip.regNo}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-600 block uppercase font-bold">
                      Invoice No
                    </span>
                    <span className="font-bold text-slate-900">{activeTrip.invoiceNo}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-600 block uppercase font-bold">
                      COD Value
                    </span>
                    <span className="font-bold text-slate-900">
                      ₹{activeTrip.expectedCod.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Material Table Preview */}
                <table className="w-full text-[10px] border border-slate-300 mb-3 text-left">
                  <thead className="bg-slate-100 border-b border-slate-300 font-semibold">
                    <tr>
                      <th className="p-1">Item / Pkg</th>
                      <th className="p-1 text-right">Qty</th>
                      <th className="p-1 text-right">Actual Wt</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="p-1">Commercial Goods (Standard Pallets)</td>
                      <td className="p-1 text-right font-mono">12 Pallets</td>
                      <td className="p-1 text-right font-mono">3,800 kg</td>
                    </tr>
                  </tbody>
                </table>

                {/* Physical Warehouse Received Stamp Mock */}
                <div className="border-2 border-dashed border-blue-600 bg-blue-50/40 p-2 rounded flex items-center justify-between mb-3">
                  <div>
                    <span className="text-[9px] font-black uppercase text-blue-900 block tracking-wider">
                      ★ RECEIVED IN GOOD ORDER & CONDITION ★
                    </span>
                    <span className="text-[10px] text-blue-800 font-medium block">
                      {activeTrip.clientName} - Gate Inward
                    </span>
                    <span className="text-[9px] font-mono text-blue-700">
                      Timestamp: {activeTrip.signatory.signedAt}
                    </span>
                  </div>
                  <div className="h-10 w-10 border-2 border-blue-700 rounded-full flex items-center justify-center text-blue-700 font-black text-[9px] rotate-[-12deg]">
                    STAMP
                  </div>
                </div>

                {/* Receiver Signature & Date */}
                <div className="border-t border-slate-300 pt-2 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] text-slate-600 block uppercase font-bold">
                      Receiver Signatory
                    </span>
                    <span className="font-bold text-slate-900 block">
                      {activeTrip.signatory.name}
                    </span>
                    <span className="text-[9px] text-slate-600 font-mono">
                      {activeTrip.signatory.designation}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-slate-600 block uppercase font-bold">
                      Driver Acknowledgement
                    </span>
                    <span className="font-bold text-slate-800 font-mono text-[10px]">
                      {activeTrip.driverName}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Sub-panel: Sign-on-Glass Digital Signature Block */}
            <div className="h-28 border-t border-slate-200 bg-white p-3 flex items-center justify-between flex-shrink-0">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Sign-on-Glass Digital Signature Proof
                </span>
                <p className="text-[11px] text-slate-600 font-mono">
                  Signatory: {activeTrip.signatory.name} ({activeTrip.signatory.designation})
                </p>
                <div className="text-[10px] text-slate-600 font-mono">
                  Captured on Driver Mobile Device • GPS verified at dock: ±4m accuracy
                </div>
              </div>

              {/* Digital Signature Simulated Box */}
              <div className="w-56 h-18 border-2 border-slate-300 rounded-md bg-slate-50 flex flex-col items-center justify-center p-2 relative">
                <div className="font-serif italic font-bold text-base text-slate-800 tracking-wide rotate-[-3deg]">
                  {activeTrip.signatory.name}
                </div>
                <div className="text-[9px] text-slate-600 font-mono mt-0.5">
                  Auth Hash: #a98f-44e2-9b01
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* RIGHT PANE: SYSTEM DATA & VERIFICATION - 6 Cols (50%) */}
          {/* ========================================================================= */}
          <section className="col-span-6 bg-white flex flex-col h-full overflow-hidden">
            {/* Scrollable Content Body */}
            <ScrollArea className="flex-1 p-5 space-y-5">
              
              {/* 1. Trip Details Card */}
              <Card className="shadow-none border-slate-200 bg-white">
                <CardHeader className="p-3.5 border-b border-slate-200 flex flex-row items-center justify-between space-y-0">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      Trip & Dispatch Telematics
                    </CardTitle>
                    <Badge variant="outline" className="font-mono text-[10px] font-bold">
                      {activeTrip.id}
                    </Badge>
                  </div>
                  <Badge
                    variant="outline"
                    className={`font-mono text-[10px] font-bold ${
                      activeTrip.status === "Flagged"
                        ? "bg-red-50 text-red-700 border-red-300"
                        : "bg-amber-50 text-amber-700 border-amber-300"
                    }`}
                  >
                    {activeTrip.status} Audit
                  </Badge>
                </CardHeader>

                <CardContent className="p-3.5 space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[11px] text-slate-600 block">Driver & Vehicle:</span>
                      <span className="font-bold text-slate-900 block">{activeTrip.driverName}</span>
                      <span className="text-[11px] font-mono text-slate-600">
                        {activeTrip.regNo} • {activeTrip.driverPhone}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-600 block">Consignee Client:</span>
                      <span className="font-bold text-slate-900 block truncate">
                        {activeTrip.clientName}
                      </span>
                      <span className="text-[11px] font-mono text-slate-600">
                        {activeTrip.invoiceNo}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-[11px] text-slate-600 block">Departure:</span>
                      <span className="font-mono text-slate-800 text-[11px] font-medium">
                        {activeTrip.departureTime}
                      </span>
                      <span className="text-[10px] text-slate-600 block truncate">
                        {activeTrip.origin}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-600 block">Arrival / Unloaded:</span>
                      <span className="font-mono text-slate-800 text-[11px] font-medium">
                        {activeTrip.arrivalTime}
                      </span>
                      <span className="text-[10px] text-slate-600 block truncate">
                        {activeTrip.destination}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-100">
                    <div className="p-2 bg-slate-50 rounded border border-slate-200">
                      <span className="text-[10px] text-slate-600 uppercase font-bold block">
                        System GPS Distance
                      </span>
                      <span className="text-sm font-black font-mono text-slate-900">
                        {activeTrip.systemGpsDistance} km
                      </span>
                    </div>

                    <div className="p-2 bg-slate-50 rounded border border-slate-200">
                      <span className="text-[10px] text-slate-600 uppercase font-bold block">
                        Odometer Logged
                      </span>
                      <span className="text-sm font-black font-mono text-slate-900">
                        {activeTrip.odometerDistance} km
                      </span>
                      <span className="text-[10px] text-emerald-600 font-mono font-medium ml-1">
                        (Diff: {Math.abs(activeTrip.systemGpsDistance - activeTrip.odometerDistance)} km)
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 2. Financial / Expense Tally Section */}
              <Card className="shadow-none border-slate-200 bg-white">
                <CardHeader className="p-3.5 border-b border-slate-200 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Financial Tally: Reported vs System Expected
                  </CardTitle>
                  <span className="text-[11px] font-mono text-slate-600">Currency: INR (₹)</span>
                </CardHeader>

                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-slate-50/75 text-[11px]">
                      <TableRow className="border-b border-slate-200">
                        <TableHead className="py-2 text-slate-600 font-semibold">Line Item</TableHead>
                        <TableHead className="py-2 text-right text-slate-600 font-semibold">
                          Driver Reported
                        </TableHead>
                        <TableHead className="py-2 text-right text-slate-600 font-semibold">
                          System Policy
                        </TableHead>
                        <TableHead className="py-2 text-right text-slate-600 font-semibold">
                          Variance
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="text-xs font-mono">
                      <TableRow className="border-b border-slate-100">
                        <TableCell className="py-2 font-sans text-slate-800">Toll Payments</TableCell>
                        <TableCell className="py-2 text-right">
                          ₹{activeTrip.reportedExpenses.toll.toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell className="py-2 text-right text-slate-600">
                          ₹{activeTrip.systemAllowedExpenses.toll.toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell className="py-2 text-right text-emerald-600 font-medium">
                          ₹{(activeTrip.reportedExpenses.toll - activeTrip.systemAllowedExpenses.toll).toLocaleString("en-IN")}
                        </TableCell>
                      </TableRow>

                      <TableRow className="border-b border-slate-100">
                        <TableCell className="py-2 font-sans text-slate-800">Fuel & AdBlue</TableCell>
                        <TableCell className="py-2 text-right">
                          ₹{activeTrip.reportedExpenses.fuel.toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell className="py-2 text-right text-slate-600">
                          ₹{activeTrip.systemAllowedExpenses.fuel.toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell className={`py-2 text-right font-medium ${
                          activeTrip.reportedExpenses.fuel > activeTrip.systemAllowedExpenses.fuel
                            ? "text-red-600"
                            : "text-emerald-600"
                        }`}>
                          {activeTrip.reportedExpenses.fuel > activeTrip.systemAllowedExpenses.fuel ? "+" : ""}
                          ₹{(activeTrip.reportedExpenses.fuel - activeTrip.systemAllowedExpenses.fuel).toLocaleString("en-IN")}
                        </TableCell>
                      </TableRow>

                      <TableRow className="border-b border-slate-100">
                        <TableCell className="py-2 font-sans text-slate-800">Driver Allowance</TableCell>
                        <TableCell className="py-2 text-right">
                          ₹{activeTrip.reportedExpenses.allowance.toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell className="py-2 text-right text-slate-600">
                          ₹{activeTrip.systemAllowedExpenses.allowance.toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell className="py-2 text-right text-slate-600">
                          ₹{(activeTrip.reportedExpenses.allowance - activeTrip.systemAllowedExpenses.allowance).toLocaleString("en-IN")}
                        </TableCell>
                      </TableRow>

                      {/* COD / Cash Received Line */}
                      <TableRow className="border-b border-slate-200 bg-slate-50/50 font-bold">
                        <TableCell className="py-2.5 font-sans text-slate-900">
                          Total COD Cash Remitted
                        </TableCell>
                        <TableCell className="py-2.5 text-right text-slate-900">
                          ₹{activeTrip.reportedCod.toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell className="py-2.5 text-right text-slate-700">
                          ₹{activeTrip.expectedCod.toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell className={`py-2.5 text-right font-black ${
                          cashDeficit === 0 ? "text-emerald-600" : "text-red-600"
                        }`}>
                          {cashDeficit === 0
                            ? "Balanced"
                            : `Deficit: -₹${Math.abs(cashDeficit).toLocaleString("en-IN")}`}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* 3. Validation Checklist (Interactive audit checks) */}
              <Card className="shadow-none border-slate-200 bg-white">
                <CardHeader className="p-3.5 border-b border-slate-200">
                  <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Audit Verification Checklist
                  </CardTitle>
                  <CardDescription className="text-[11px] text-slate-500">
                    All mandatory checks must be acknowledged prior to sending invoice to billing.
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-3.5 space-y-2">
                  {[
                    {
                      key: "distanceMatch",
                      label: "Distance Match: GPS Corridor aligns within ±3% of Odometer",
                    },
                    {
                      key: "cashMatch",
                      label: "Cash Match: Remitted Cash conforms to invoice COD line value",
                    },
                    {
                      key: "signaturePresent",
                      label: "Signature Present: Valid receiver digital / glass sign captured",
                    },
                    {
                      key: "consigneeStamp",
                      label: "Consignee Stamp Verified: Official dock stamp visible on physical LR",
                    },
                    {
                      key: "podQualityReadable",
                      label: "Document Legibility: All product quantities and seal serials readable",
                    },
                  ].map((item) => {
                    const isChecked = checklist[item.key as keyof typeof checklist];
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => toggleCheck(item.key as keyof typeof checklist)}
                        className={`w-full flex items-center justify-between p-2 rounded-md border text-xs text-left transition-all ${
                          isChecked
                            ? "bg-slate-50/80 border-slate-300 text-slate-900"
                            : "bg-red-50/50 border-red-200 text-red-900"
                        }`}
                      >
                        <span className="font-medium pr-2">{item.label}</span>
                        {isChecked ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </CardContent>
              </Card>
            </ScrollArea>

            {/* STICKY ACTION FOOTER (Bottom of Right Pane) */}
            <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex items-center space-x-3 flex-shrink-0">
              {/* Massive Red Outline Button: Raise Discrepancy */}
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDisputeModalOpen(true)}
                className="flex-1 py-6 text-sm font-bold text-red-600 border-2 border-red-300 hover:bg-red-50 hover:text-red-700 hover:border-red-400 active:scale-[0.99] transition-all"
              >
                <AlertOctagon className="h-4 w-4 mr-1.5" />
                Raise Discrepancy
              </Button>

              {/* Massive Solid Green/Blue Button: Verify & Send to Billing */}
              <Button
                type="button"
                onClick={handleVerifyAndApprove}
                className="flex-1 py-6 text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Verify & Send to Billing
              </Button>
            </div>
          </section>
        </div>
      </div>

      {/* DISCREPANCY REJECTION REASON MODAL */}
      <Dialog open={isDisputeModalOpen} onOpenChange={setIsDisputeModalOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden border-slate-200 shadow-xl">
          <DialogHeader className="p-5 border-b border-slate-200 bg-red-50/60">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <DialogTitle className="text-base font-semibold text-red-950">
                Raise Audit Discrepancy
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-red-800 mt-1">
              Mark trip {activeTrip.id} ({activeTrip.invoiceNo}) as disputed and send notice to Dispatch and Accounts.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleConfirmDiscrepancy}>
            <div className="p-5 space-y-3">
              <div>
                <Label htmlFor="reason" className="text-xs font-bold text-slate-800">
                  Discrepancy Justification *
                </Label>
                <Textarea
                  id="reason"
                  rows={4}
                  value={discrepancyReason}
                  onChange={(e) => setDiscrepancyReason(e.target.value)}
                  className="mt-1 text-xs border-slate-300"
                  required
                />
              </div>

              <div className="p-2.5 rounded bg-slate-100 border border-slate-200 text-[11px] text-slate-600">
                Notice will automatically freeze this invoice from ERP batch export until driver or dispatch resolves the reconciliation gap.
              </div>
            </div>

            <DialogFooter className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsDisputeModalOpen(false)}
                className="h-8 text-xs border-slate-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="h-8 text-xs bg-red-600 hover:bg-red-700 text-white font-semibold"
              >
                Confirm Rejection & Flag
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  MapPin,
  GitFork,
  Receipt,
  Settings,
  Search,
  Calendar,
  Truck,
  Fuel,
  CreditCard,
  Banknote,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  DollarSign,
  ChevronDown,
  Building2,
  ShieldCheck,
  Smartphone,
  FileCheck2,
  Building,
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

// Types
type TripStatus = "In Transit" | "Unloading" | "Delayed";

interface VehicleTrip {
  id: string;
  regNo: string;
  driverName: string;
  driverPhone: string;
  origin: string;
  destination: string;
  startOdometer: number;
  currentOdometer: number;
  status: TripStatus;
  tripAdvance: number;
  expectedCod: number;
  loadType: string;
  eta: string;
}

// Realistic Dummy Logistics Data
const INITIAL_FLEET_DATA: VehicleTrip[] = [
  {
    id: "TRIP-8841",
    regNo: "MH 12 RN 4920",
    driverName: "Rajesh Kumar",
    driverPhone: "+91 98231 44021",
    origin: "Bhiwandi Hub, MH",
    destination: "Sanand Industrial Park, GJ",
    startOdometer: 142380,
    currentOdometer: 142890,
    status: "In Transit",
    tripAdvance: 12000,
    expectedCod: 48500,
    loadType: "Automotive Parts (FTL)",
    eta: "Today, 18:30",
  },
  {
    id: "TRIP-8842",
    regNo: "KA 01 AJ 3319",
    driverName: "Manjunath S.",
    driverPhone: "+91 94481 02931",
    origin: "Hosur DC, TN",
    destination: "Peenya Industrial Area, KA",
    startOdometer: 89410,
    currentOdometer: 89540,
    status: "Unloading",
    tripAdvance: 6000,
    expectedCod: 22000,
    loadType: "FMCG Wholesale",
    eta: "Docked (Gate 4)",
  },
  {
    id: "TRIP-8843",
    regNo: "HR 55 AH 7812",
    driverName: "Sukhwinder Singh",
    driverPhone: "+91 98112 55902",
    origin: "Gurugram Hub, HR",
    destination: "Baddi Pharma Corridor, HP",
    startOdometer: 210450,
    currentOdometer: 210780,
    status: "Delayed",
    tripAdvance: 15000,
    expectedCod: 62000,
    loadType: "Cold Chain Pharma",
    eta: "Delayed by 3h (NH-44 traffic)",
  },
  {
    id: "TRIP-8844",
    regNo: "DL 1M 6023",
    driverName: "Virender Tyagi",
    driverPhone: "+91 99104 22391",
    origin: "Okhla Ph-III, DL",
    destination: "Jaipur Logistics Hub, RJ",
    startOdometer: 64120,
    currentOdometer: 64415,
    status: "In Transit",
    tripAdvance: 9000,
    expectedCod: 31500,
    loadType: "Consumer Electronics",
    eta: "Today, 21:00",
  },
  {
    id: "TRIP-8845",
    regNo: "TS 08 UB 9044",
    driverName: "K. Venkatesh",
    driverPhone: "+91 90002 81729",
    origin: "Shamshabad Cargo, TS",
    destination: "Sri City SEZ, AP",
    startOdometer: 118760,
    currentOdometer: 119280,
    status: "In Transit",
    tripAdvance: 14000,
    expectedCod: 54000,
    loadType: "Heavy Machinery Parts",
    eta: "Tomorrow, 04:15",
  },
  {
    id: "TRIP-8846",
    regNo: "TN 22 BQ 4109",
    driverName: "Murugan Selvam",
    driverPhone: "+91 97890 31284",
    origin: "Ennore Port, TN",
    destination: "Coimbatore ICD, TN",
    startOdometer: 175220,
    currentOdometer: 175710,
    status: "Unloading",
    tripAdvance: 11000,
    expectedCod: 41000,
    loadType: "Textile Machinery",
    eta: "Docked (Bay 2)",
  },
  {
    id: "TRIP-8847",
    regNo: "WB 23 D 1892",
    driverName: "Tapan Mondal",
    driverPhone: "+91 98302 99182",
    origin: "Dankuni Yard, WB",
    destination: "Jamshedpur Works, JH",
    startOdometer: 198300,
    currentOdometer: 198590,
    status: "Delayed",
    tripAdvance: 8500,
    expectedCod: 36000,
    loadType: "Steel Structural Spares",
    eta: "Delayed (Rerouted via NH-16)",
  },
  {
    id: "TRIP-8848",
    regNo: "GJ 06 AX 5521",
    driverName: "Chetan Parmar",
    driverPhone: "+91 97271 88401",
    origin: "Hazira Port, GJ",
    destination: "Pithampur Auto Cluster, MP",
    startOdometer: 104500,
    currentOdometer: 105050,
    status: "In Transit",
    tripAdvance: 13500,
    expectedCod: 49500,
    loadType: "Chemical Drums (Non-Haz)",
    eta: "Today, 23:45",
  },
];

export default function DispatchManagerDashboard() {
  // Navigation State
  const [activeMenu, setActiveMenu] = useState<string>("Dashboard");

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("ALL");

  // Modal & Selection State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"expense" | "close">("expense");
  const [selectedTrip, setSelectedTrip] = useState<VehicleTrip | null>(null);

  // EOD Form Expense & Cash Fields
  const [tollPayments, setTollPayments] = useState<string>("2450");
  const [driverAllowance, setDriverAllowance] = useState<string>("1200");
  const [emergencyFuel, setEmergencyFuel] = useState<string>("3800");
  const [totalCashCollected, setTotalCashCollected] = useState<string>("48500");

  // Summary Metrics calculations
  const totalFleetCount = INITIAL_FLEET_DATA.length;
  const activeTripsCount = INITIAL_FLEET_DATA.filter(
    (t) => t.status === "In Transit" || t.status === "Unloading"
  ).length;
  const idleDelayedCount = INITIAL_FLEET_DATA.filter(
    (t) => t.status === "Delayed"
  ).length;

  // Filtered Grid Data
  const filteredFleet = useMemo(() => {
    return INITIAL_FLEET_DATA.filter((trip) => {
      const matchesSearch =
        trip.regNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatusFilter === "ALL" || trip.status === selectedStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, selectedStatusFilter]);

  // Open EOD Modal for a Trip
  const handleOpenEodModal = (trip: VehicleTrip, mode: "expense" | "close") => {
    setSelectedTrip(trip);
    setModalMode(mode);

    // Contextually populate realistic defaults based on the trip
    if (mode === "close") {
      setTollPayments("2850");
      setDriverAllowance("1500");
      setEmergencyFuel("4200");
      setTotalCashCollected(trip.expectedCod.toString());
    } else {
      setTollPayments("1200");
      setDriverAllowance("800");
      setEmergencyFuel("2500");
      setTotalCashCollected(trip.expectedCod.toString());
    }

    setIsModalOpen(true);
  };

  // EOD Tally Calculations
  const toll = parseFloat(tollPayments) || 0;
  const allowance = parseFloat(driverAllowance) || 0;
  const fuel = parseFloat(emergencyFuel) || 0;
  const actualCash = parseFloat(totalCashCollected) || 0;

  const totalTripExpenses = toll + allowance + fuel;
  const tripAdvance = selectedTrip?.tripAdvance || 0;
  const expectedCashCollection = selectedTrip?.expectedCod || 0;

  // Expected cash to be remitted to dispatch desk:
  // Expected COD collection + (Advance unused, i.e., Advance - Expenses)
  // Or in 3PL settlement: Expected Remittance = COD Collected + Unspent Advance
  const advanceBalance = tripAdvance - totalTripExpenses;
  const netExpectedRemittance = expectedCashCollection + advanceBalance;
  const discrepancy = actualCash - netExpectedRemittance;

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTrip(null);
  };

  const handleSubmitTally = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate commit & reconciliation
    alert(
      `Reconciliation Voucher Created for ${selectedTrip?.regNo}!\nMode: ${
        modalMode === "close" ? "Trip Closure" : "Expense Logging"
      }\nExpenses Logged: ₹${totalTripExpenses.toLocaleString(
        "en-IN"
      )}\nActual Cash Received: ₹${actualCash.toLocaleString(
        "en-IN"
      )}\nDiscrepancy: ₹${discrepancy.toLocaleString("en-IN")}`
    );
    setIsModalOpen(false);
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-800 font-sans antialiased overflow-hidden">
      {/* 1. LEFT SIDEBAR NAVIGATION */}
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
                POD-TO-CASH ENGINE
              </span>
            </div>
          </div>
        </div>

        {/* Role Identity Tag */}
        <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
              <span className="text-xs font-medium text-slate-700">
                Dispatch Manager
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-600">ID: DIS-04</span>
          </div>
          <p className="text-[11px] text-slate-600 mt-1 truncate">
            Western Corridor Hub #4 (Bhiwandi)
          </p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {[
            { name: "Dashboard", icon: LayoutDashboard },
            { name: "Live Fleet Map", icon: MapPin },
            { name: "Trip Allocation", icon: GitFork },
            { name: "EOD Reconciliation", icon: Receipt },
            { name: "Settings", icon: Settings },
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
                <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-500"}`} />
                <span>{item.name}</span>
                {item.name === "EOD Reconciliation" && (
                  <span className="ml-auto text-[10px] font-mono bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                    3 Pending
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer / System Health */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/50">
          <div className="rounded-md border border-slate-200 bg-white p-2.5">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="h-3.5 w-3.5 text-slate-500" />
                Audit Trail Mode
              </span>
              <span className="text-[10px] text-emerald-600 font-mono font-medium">SYNCED</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-600 font-mono">
              Auto-settle SLA: 18:00 IST
            </div>
          </div>
        </div>
      </aside>

      {/* RIGHT MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* 2. TOP HEADER */}
        <header className="h-14 border-b border-slate-200 bg-white px-6 flex items-center justify-between gap-4 flex-shrink-0">
          {/* Left search & simulated date */}
          <div className="flex items-center space-x-4 flex-1 max-w-xl">
            {/* Search Input */}
            <div className="relative w-72">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search Reg No, Driver, Destination..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-8 text-xs bg-slate-50/50 border-slate-200 focus-visible:bg-white"
              />
            </div>

            {/* Simulated Date Picker */}
            <div className="flex items-center space-x-2 px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 text-xs text-slate-700">
              <Calendar className="h-3.5 w-3.5 text-slate-500" />
              <span className="font-mono text-[11px] font-medium">
                02-Oct-2026 (Shift 1)
              </span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </div>
          </div>

          {/* Right Header Status Summary & Actions */}
          <div className="flex items-center space-x-3">
            {/* Live Operational Status Summary Badge */}
            <Badge
              variant="outline"
              className="bg-slate-50 border-slate-200 text-slate-700 font-mono text-xs px-2.5 py-1 flex items-center gap-1.5"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-slate-900">{activeTripsCount} Active</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500">{idleDelayedCount} Delayed</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500">{totalFleetCount} Total Fleet</span>
            </Badge>

            <Link href="/audit">
              <Button size="sm" variant="outline" className="h-8 text-xs font-semibold border-slate-300 bg-white text-slate-800 hover:bg-slate-100 flex items-center gap-1.5 shadow-xs">
                <FileCheck2 className="h-3.5 w-3.5 text-indigo-600" />
                Audit
              </Button>
            </Link>

            <Link href="/accounts">
              <Button size="sm" variant="outline" className="h-8 text-xs font-semibold border-slate-300 bg-white text-slate-800 hover:bg-slate-100 flex items-center gap-1.5 shadow-xs">
                <Receipt className="h-3.5 w-3.5 text-emerald-600" />
                Accounts & Billing
              </Button>
            </Link>

            <Link href="/client-portal">
              <Button size="sm" variant="outline" className="h-8 text-xs font-semibold border-amber-300 bg-amber-50/50 text-amber-900 hover:bg-amber-100 flex items-center gap-1.5 shadow-xs">
                <Building className="h-3.5 w-3.5 text-amber-700" />
                Client AP Portal
              </Button>
            </Link>

            <Link href="/driver">
              <Button size="sm" variant="outline" className="h-8 text-xs font-semibold border-slate-300 bg-white text-slate-800 hover:bg-slate-100 flex items-center gap-1.5 shadow-xs">
                <Smartphone className="h-3.5 w-3.5 text-blue-600" />
                Driver App
              </Button>
            </Link>

            <Button size="sm" variant="default" className="h-8 text-xs font-medium">
              + New Trip Dispatch
            </Button>
          </div>
        </header>

        {/* 3. MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="shadow-none border-slate-200 bg-white">
              <CardContent className="p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">Live Dispatched</span>
                  <Truck className="h-4 w-4 text-slate-400" />
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-xl font-bold font-mono text-slate-900">{activeTripsCount}</span>
                  <span className="text-[11px] text-slate-500 font-mono">82% on schedule</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-none border-slate-200 bg-white">
              <CardContent className="p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">Expected COD Inbound</span>
                  <Banknote className="h-4 w-4 text-slate-400" />
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-xl font-bold font-mono text-slate-900">₹3,44,500</span>
                  <span className="text-[11px] text-slate-500 font-mono">8 Trips</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-none border-slate-200 bg-white">
              <CardContent className="p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">Dispatched Advances</span>
                  <CreditCard className="h-4 w-4 text-slate-400" />
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-xl font-bold font-mono text-slate-900">₹88,500</span>
                  <span className="text-[11px] text-slate-500 font-mono">Fuel & Toll Float</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-none border-slate-200 bg-white">
              <CardContent className="p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">Pending EOD Audit</span>
                  <Clock className="h-4 w-4 text-amber-500" />
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-xl font-bold font-mono text-amber-600">2 Vehicles</span>
                  <span className="text-[11px] text-amber-700 font-medium font-mono">Docked & Waiting</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* WIDGET 1: Live Vehicle & Trip Grid */}
          <Card className="shadow-none border-slate-200 bg-white">
            <CardHeader className="p-4 border-b border-slate-200 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-sm font-semibold text-slate-900">
                  Live Vehicle & Trip Master
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-0.5">
                  Real-time GPS telematics, driver allocation, and pending settlement triggers.
                </CardDescription>
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center space-x-1.5">
                <span className="text-xs text-slate-600 flex items-center gap-1 mr-1">
                  <Filter className="h-3 w-3" /> Filter:
                </span>
                {(["ALL", "In Transit", "Unloading", "Delayed"] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedStatusFilter(filter)}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
                      selectedStatusFilter === filter
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/75">
                  <TableRow className="border-b border-slate-200 hover:bg-transparent">
                    <TableHead className="text-xs font-semibold text-slate-600 py-2.5 w-[140px]">
                      Vehicle Reg No
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600 py-2.5 w-[180px]">
                      Driver Name
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600 py-2.5">
                      Destination & Route
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600 py-2.5 text-right w-[130px]">
                      Start Odometer
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600 py-2.5 text-center w-[120px]">
                      Status
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600 py-2.5 text-right w-[200px]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFleet.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center text-xs text-slate-400">
                        No active vehicles found matching filter criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredFleet.map((trip) => {
                      // Determine status badge styling
                      let badgeStyle = "bg-slate-100 text-slate-700 border-slate-300";
                      if (trip.status === "In Transit") {
                        badgeStyle = "bg-blue-50 text-blue-700 border-blue-200";
                      } else if (trip.status === "Unloading") {
                        badgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-200";
                      } else if (trip.status === "Delayed") {
                        badgeStyle = "bg-amber-50 text-amber-800 border-amber-300";
                      }

                      return (
                        <TableRow
                          key={trip.id}
                          className="border-b border-slate-200 hover:bg-slate-50/70 transition-colors text-xs"
                        >
                          {/* Vehicle Reg No */}
                          <TableCell className="py-2.5 font-mono font-medium text-slate-900">
                            <div className="flex flex-col">
                              <span className="font-semibold">{trip.regNo}</span>
                              <span className="text-[10px] text-slate-600 font-sans">
                                {trip.id}
                              </span>
                            </div>
                          </TableCell>

                          {/* Driver Name */}
                          <TableCell className="py-2.5 text-slate-800">
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-900">{trip.driverName}</span>
                              <span className="text-[11px] text-slate-600 font-mono">
                                {trip.driverPhone}
                              </span>
                            </div>
                          </TableCell>

                          {/* Destination */}
                          <TableCell className="py-2.5">
                            <div className="flex flex-col">
                              <div className="flex items-center text-slate-800 font-medium">
                                <span className="truncate max-w-[260px]">{trip.destination}</span>
                              </div>
                              <span className="text-[10px] text-slate-600 flex items-center gap-1 mt-0.5">
                                <span className="text-slate-600">From:</span> {trip.origin} •{" "}
                                <span className="font-mono text-slate-600">{trip.eta}</span>
                              </span>
                            </div>
                          </TableCell>

                          {/* Start Odometer */}
                          <TableCell className="py-2.5 text-right font-mono text-slate-800">
                            <div>
                              <span>{trip.startOdometer.toLocaleString()} km</span>
                              <div className="text-[10px] text-slate-600">
                                Cur: {trip.currentOdometer.toLocaleString()} km
                              </div>
                            </div>
                          </TableCell>

                          {/* Status Badge */}
                          <TableCell className="py-2.5 text-center">
                            <Badge
                              variant="outline"
                              className={`text-[11px] font-medium px-2 py-0.5 rounded ${badgeStyle}`}
                            >
                              {trip.status}
                            </Badge>
                          </TableCell>

                          {/* Action Column */}
                          <TableCell className="py-2.5 text-right">
                            <div className="flex items-center justify-end space-x-1.5">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenEodModal(trip, "expense")}
                                className="h-7 text-[11px] px-2.5 border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                              >
                                Log Expense
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenEodModal(trip, "close")}
                                className="h-7 text-[11px] px-2.5 border-slate-300 font-medium text-slate-900 bg-white hover:bg-slate-100"
                              >
                                Close Trip
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>

            <div className="p-3 bg-slate-50/50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Showing {filteredFleet.length} of {INITIAL_FLEET_DATA.length} active fleet deployments</span>
              <span className="font-mono">Audit Standard: ISO-28000 / POD-2PL</span>
            </div>
          </Card>
        </main>
      </div>

      {/* WIDGET 2: EOD (End of Day) Cash & Expense Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-xl p-0 gap-0 overflow-hidden border-slate-200 shadow-xl">
          {/* Header */}
          <DialogHeader className="p-5 border-b border-slate-200 bg-slate-50/80">
            <div className="flex items-center justify-between pr-4">
              <div>
                <DialogTitle className="text-base font-semibold text-slate-900">
                  {modalMode === "close" ? "EOD Trip Settlement & Close" : "EOD Expense Voucher"}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 mt-1">
                  Reconcile driver cash float, trip expenses, and POD collections.
                </DialogDescription>
              </div>
              <Badge variant="outline" className="font-mono text-xs bg-white border-slate-200">
                {selectedTrip?.regNo}
              </Badge>
            </div>

            {/* Trip Context Card inside Dialog */}
            {selectedTrip && (
              <div className="mt-3.5 grid grid-cols-3 gap-2 p-2.5 rounded-md border border-slate-200 bg-white text-[11px]">
                <div>
                  <span className="text-slate-600 block">Driver:</span>
                  <span className="font-medium text-slate-800">{selectedTrip.driverName}</span>
                </div>
                <div>
                  <span className="text-slate-600 block">Trip Advance:</span>
                  <span className="font-mono font-medium text-slate-800">
                    ₹{selectedTrip.tripAdvance.toLocaleString("en-IN")}
                  </span>
                </div>
                <div>
                  <span className="text-slate-600 block">Expected COD:</span>
                  <span className="font-mono font-semibold text-emerald-600">
                    ₹{selectedTrip.expectedCod.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            )}
          </DialogHeader>

          {/* Form Body */}
          <form onSubmit={handleSubmitTally}>
            <div className="p-5 space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Receipt className="h-3.5 w-3.5 text-slate-500" /> Expense Deductions (₹)
              </div>

              {/* Grid Form Fields */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <Label htmlFor="tollPayments">Toll Payments (FASTag / Cash)</Label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-600">
                      ₹
                    </span>
                    <Input
                      id="tollPayments"
                      type="number"
                      value={tollPayments}
                      onChange={(e) => setTollPayments(e.target.value)}
                      placeholder="0"
                      className="pl-6 h-8 text-xs font-mono text-slate-800 border-slate-200"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="driverAllowance">Driver Daily Allowance (Bhatta)</Label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-600">
                      ₹
                    </span>
                    <Input
                      id="driverAllowance"
                      type="number"
                      value={driverAllowance}
                      onChange={(e) => setDriverAllowance(e.target.value)}
                      placeholder="0"
                      className="pl-6 h-8 text-xs font-mono text-slate-800 border-slate-200"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="emergencyFuel">Emergency Fuel / AdBlue Slip</Label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-600">
                      ₹
                    </span>
                    <Input
                      id="emergencyFuel"
                      type="number"
                      value={emergencyFuel}
                      onChange={(e) => setEmergencyFuel(e.target.value)}
                      placeholder="0"
                      className="pl-6 h-8 text-xs font-mono text-slate-800 border-slate-200"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="totalCashCollected" className="text-slate-900 font-bold">
                    Total Cash Collected (POD / COD)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-600">
                      ₹
                    </span>
                    <Input
                      id="totalCashCollected"
                      type="number"
                      value={totalCashCollected}
                      onChange={(e) => setTotalCashCollected(e.target.value)}
                      placeholder="0"
                      className="pl-6 h-8 text-xs font-mono font-semibold text-slate-900 bg-slate-50/70 border-slate-300"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Tally Visual Section: Expected vs Actual */}
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center justify-between mb-2">
                  <span>Reconciliation Tally Breakdown</span>
                  <span className="text-[10px] font-normal text-slate-600">Real-time audit math</span>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50/90 p-3 space-y-2">
                  {/* Calculation Rows */}
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>Total Trip Expenses (Toll + Allowance + Fuel):</span>
                    <span className="font-mono text-slate-800">
                      ₹{totalTripExpenses.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>Unspent Driver Advance (Advance - Expenses):</span>
                    <span className={`font-mono ${advanceBalance >= 0 ? "text-slate-800" : "text-red-600"}`}>
                      {advanceBalance >= 0 ? `+ ₹${advanceBalance.toLocaleString("en-IN")}` : `- ₹${Math.abs(advanceBalance).toLocaleString("en-IN")}`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-700 font-medium pt-1 border-t border-slate-200/80">
                    <span>Expected Net Cash Remittance:</span>
                    <span className="font-mono font-semibold text-slate-900">
                      ₹{netExpectedRemittance.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-700 font-medium">
                    <span>Actual Cash Handed Over:</span>
                    <span className="font-mono font-semibold text-slate-900">
                      ₹{actualCash.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Discrepancy Alert Box */}
                  <div
                    className={`mt-2 p-2.5 rounded-md flex items-center justify-between text-xs border ${
                      discrepancy === 0
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                        : discrepancy > 0
                        ? "bg-blue-50 border-blue-200 text-blue-800"
                        : "bg-red-50 border-red-200 text-red-800"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {discrepancy === 0 ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0" />
                      )}
                      <span className="font-medium">
                        {discrepancy === 0
                          ? "Perfect Match: Zero Discrepancy"
                          : discrepancy > 0
                          ? `Surplus Cash: +₹${discrepancy.toLocaleString("en-IN")}`
                          : `Deficit / Shortage: -₹${Math.abs(discrepancy).toLocaleString("en-IN")}`}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/70 font-semibold">
                      {discrepancy === 0 ? "Balanced" : discrepancy > 0 ? "Surplus" : "Action Req."}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dialog Footer */}
            <DialogFooter className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseModal}
                className="h-8 text-xs px-3 border-slate-200 text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                className="h-8 text-xs px-3.5 bg-slate-900 hover:bg-slate-800 text-white font-medium"
              >
                Submit Tally
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

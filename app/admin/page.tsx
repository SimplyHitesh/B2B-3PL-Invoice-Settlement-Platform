"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Truck,
  UserCheck,
  Building2,
  Tag,
  Search,
  Plus,
  Edit2,
  UserPlus,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Mail,
  MoreHorizontal,
  Power,
  RotateCcw,
  LayoutDashboard,
  Smartphone,
  Receipt,
  FileCheck2,
  Lock,
  ChevronRight,
  Filter,
  Check,
  Copy,
  Clock,
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
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

// Types
export type UserRole =
  | "Admin"
  | "Dispatcher"
  | "Auditor"
  | "Accounts"
  | "Client AP"
  | "Driver";

export type UserStatus = "Active" | "Invited" | "Deactivated";

export interface MasterUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  hub: string;
  status: UserStatus;
  lastActive: string;
}

export interface MasterVehicle {
  regNo: string;
  makeModel: string;
  tonnage: string;
  hub: string;
  assignedDriver: string;
  status: "In Fleet" | "Maintenance";
}

export interface MasterDriver {
  id: string;
  name: string;
  phone: string;
  licenseNo: string;
  assignedTruck: string;
  status: "On Route" | "Available" | "Off Duty";
}

// Initial Mock Master Data
const INITIAL_USERS: MasterUser[] = [
  {
    id: "USR-001",
    name: "Vikram Malhotra",
    email: "vikram.m@vectologistics.in",
    role: "Admin",
    hub: "Central Headquarters (Mumbai)",
    status: "Active",
    lastActive: "Today, 14:45",
  },
  {
    id: "USR-002",
    name: "Amitabh Sen",
    email: "dispatch.bhiwandi@vectologistics.in",
    role: "Dispatcher",
    hub: "Bhiwandi Terminal #4",
    status: "Active",
    lastActive: "Today, 15:10",
  },
  {
    id: "USR-003",
    name: "Pooja Sharma",
    email: "audit.l2@vectologistics.in",
    role: "Auditor",
    hub: "National Audit Desk",
    status: "Active",
    lastActive: "Today, 13:20",
  },
  {
    id: "USR-004",
    name: "Rohan Deshmukh",
    email: "billing.west@vectologistics.in",
    role: "Accounts",
    hub: "Western Region Billing",
    status: "Active",
    lastActive: "Yesterday",
  },
  {
    id: "USR-005",
    name: "K. Ramesh",
    email: "k.ramesh@metro-wholesale.in",
    role: "Client AP",
    hub: "Metro Cash & Carry (Whitefield DC)",
    status: "Active",
    lastActive: "02-Oct-2026",
  },
  {
    id: "USR-006",
    name: "Rajesh Kumar",
    email: "driver.rajesh@vectologistics.in",
    role: "Driver",
    hub: "Bhiwandi Hub #4",
    status: "Active",
    lastActive: "Today, 14:28",
  },
  {
    id: "USR-007",
    name: "Sunil Verma",
    email: "sunil.verma@tatamotors.com",
    role: "Client AP",
    hub: "Tata Motors Sanand Plant",
    status: "Invited",
    lastActive: "Pending Token Accept",
  },
  {
    id: "USR-008",
    name: "Tapan Mondal",
    email: "driver.tapan@vectologistics.in",
    role: "Driver",
    hub: "Dankuni Yard",
    status: "Deactivated",
    lastActive: "15-Sep-2026",
  },
];

const INITIAL_VEHICLES: MasterVehicle[] = [
  {
    regNo: "MH 12 RN 4920",
    makeModel: "Eicher Pro 6016 (16T)",
    tonnage: "16.0 MT",
    hub: "Bhiwandi Hub #4",
    assignedDriver: "Rajesh Kumar",
    status: "In Fleet",
  },
  {
    regNo: "KA 01 AJ 3319",
    makeModel: "Tata Ultra T.12",
    tonnage: "12.0 MT",
    hub: "Hosur Terminal",
    assignedDriver: "Manjunath S.",
    status: "In Fleet",
  },
  {
    regNo: "HR 55 AH 7812",
    makeModel: "BharatBenz 2823R",
    tonnage: "28.0 MT",
    hub: "Gurugram DC",
    assignedDriver: "Sukhwinder Singh",
    status: "Maintenance",
  },
  {
    regNo: "DL 1M 6023",
    makeModel: "Ashok Leyland Ecomet",
    tonnage: "11.0 MT",
    hub: "Okhla Hub",
    assignedDriver: "Virender Tyagi",
    status: "In Fleet",
  },
];

const INITIAL_DRIVERS: MasterDriver[] = [
  {
    id: "DRV-101",
    name: "Rajesh Kumar",
    phone: "+91 98231 44021",
    licenseNo: "MH12-2015-88412",
    assignedTruck: "MH 12 RN 4920",
    status: "On Route",
  },
  {
    id: "DRV-102",
    name: "Manjunath S.",
    phone: "+91 94481 02931",
    licenseNo: "KA01-2018-99120",
    assignedTruck: "KA 01 AJ 3319",
    status: "Available",
  },
  {
    id: "DRV-103",
    name: "Sukhwinder Singh",
    phone: "+91 98112 55902",
    licenseNo: "HR55-2012-34019",
    assignedTruck: "HR 55 AH 7812",
    status: "Off Duty",
  },
];

export default function AdminDashboardPage() {
  const [activeMenu, setActiveMenu] = useState<string>("Users & Roles");
  const [activeTab, setActiveTab] = useState<string>("users");
  const [searchQuery, setSearchQuery] = useState("");

  // Master Users State
  const [users, setUsers] = useState<MasterUser[]>(INITIAL_USERS);

  // Invite Modal State
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<UserRole>("Dispatcher");
  const [inviteHub, setInviteHub] = useState("Bhiwandi Hub #4");
  const [generatedInviteLink, setGeneratedInviteLink] = useState<string | null>(null);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q) ||
        u.hub.toLowerCase().includes(q) ||
        u.status.toLowerCase().includes(q)
    );
  }, [users, searchQuery]);

  // Toggle user activation
  const handleToggleDeactivate = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus: UserStatus =
            u.status === "Active" ? "Deactivated" : "Active";
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  // Invite User Submit
  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteName) return;

    const newId = `USR-00${users.length + 1}`;
    const token = `inv_${Math.random().toString(36).substring(2, 10)}`;
    const link = `http://localhost:3000/invite/accept?token=${token}`;

    const newUser: MasterUser = {
      id: newId,
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      hub: inviteHub,
      status: "Invited",
      lastActive: "Invite Sent Just Now",
    };

    setUsers([newUser, ...users]);
    setGeneratedInviteLink(link);
  };

  const handleCloseInviteModal = () => {
    setIsInviteModalOpen(false);
    setInviteName("");
    setInviteEmail("");
    setInviteRole("Dispatcher");
    setGeneratedInviteLink(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Invite link copied to clipboard!");
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
                ADMIN MASTER DATA
              </span>
            </div>
          </div>
        </div>

        {/* Admin Role Identity Tag */}
        <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-purple-600 ring-2 ring-purple-100" />
              <span className="text-xs font-semibold text-slate-800">
                System Administration
              </span>
            </div>
            <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200 font-bold">
              ADM-01
            </span>
          </div>
          <p className="text-[11px] text-slate-600 mt-1 truncate">
            Enterprise Security & Master Records
          </p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {[
            { name: "Users & Roles", icon: Users, tab: "users", badge: `${users.length}` },
            { name: "Vehicles", icon: Truck, tab: "vehicles", badge: `${INITIAL_VEHICLES.length}` },
            { name: "Drivers", icon: UserCheck, tab: "drivers", badge: `${INITIAL_DRIVERS.length}` },
            { name: "Clients & Vendors", icon: Building2, tab: "clients", badge: "8" },
            { name: "Rate Cards", icon: Tag, tab: "rates", badge: "SAC-9965" },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.name;
            return (
              <button
                key={item.name}
                onClick={() => {
                  setActiveMenu(item.name);
                  setActiveTab(item.tab);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-500"}`} />
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

        {/* Quick Link Switcher to Operational Roles */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/50">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1 mb-1.5 block">
            Operational Workspaces
          </span>
          <div className="space-y-1 text-xs">
            <Link
              href="/dispatch"
              className="flex items-center justify-between p-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900"
            >
              <span className="flex items-center gap-1.5">
                <LayoutDashboard className="h-3.5 w-3.5 text-slate-500" /> Dispatch
              </span>
              <ExternalLink className="h-3 w-3 text-slate-400" />
            </Link>
            <Link
              href="/audit"
              className="flex items-center justify-between p-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900"
            >
              <span className="flex items-center gap-1.5">
                <FileCheck2 className="h-3.5 w-3.5 text-indigo-600" /> Audit
              </span>
              <ExternalLink className="h-3 w-3 text-slate-400" />
            </Link>
            <Link
              href="/accounts"
              className="flex items-center justify-between p-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900"
            >
              <span className="flex items-center gap-1.5">
                <Receipt className="h-3.5 w-3.5 text-emerald-600" /> Billing
              </span>
              <ExternalLink className="h-3 w-3 text-slate-400" />
            </Link>
            <Link
              href="/login"
              className="flex items-center justify-between p-1.5 rounded hover:bg-red-50 text-red-600 font-medium"
            >
              <span className="flex items-center gap-1.5">
                <Power className="h-3.5 w-3.5" /> Log Out
              </span>
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
              placeholder="Search by Name, Email, Role, Hub..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 text-xs bg-slate-50/50 border-slate-200 focus-visible:bg-white"
            />
          </div>

          {/* Action Button & System Metrics */}
          <div className="flex items-center space-x-3">
            <Badge
              variant="outline"
              className="bg-slate-50 border-slate-200 text-slate-700 font-mono text-xs px-2.5 py-1"
            >
              <span className="text-slate-500 font-sans">Active Users:</span>{" "}
              <strong className="text-slate-900">{users.filter((u) => u.status === "Active").length}</strong>
              <span className="mx-1 text-slate-300">|</span>
              <span className="text-slate-500 font-sans">Invited:</span>{" "}
              <strong className="text-amber-600">{users.filter((u) => u.status === "Invited").length}</strong>
            </Badge>

            <Button
              size="sm"
              onClick={() => setIsInviteModalOpen(true)}
              className="h-8 text-xs font-semibold bg-blue-800 hover:bg-blue-900 text-white flex items-center gap-1.5 shadow-sm"
            >
              <UserPlus className="h-3.5 w-3.5" />
              + Invite User
            </Button>
          </div>
        </header>

        {/* 3. MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-6 space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-4">
            {/* View Switcher Pills */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <TabsList className="bg-slate-200/80 p-0.5 h-8">
                <TabsTrigger
                  value="users"
                  onClick={() => setActiveMenu("Users & Roles")}
                  className="h-7 text-xs font-semibold data-[state=active]:bg-white"
                >
                  Users & Roles
                  <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700 font-mono">
                    {users.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="vehicles"
                  onClick={() => setActiveMenu("Vehicles")}
                  className="h-7 text-xs font-semibold data-[state=active]:bg-white"
                >
                  Vehicles
                </TabsTrigger>
                <TabsTrigger
                  value="drivers"
                  onClick={() => setActiveMenu("Drivers")}
                  className="h-7 text-xs font-semibold data-[state=active]:bg-white"
                >
                  Drivers
                </TabsTrigger>
              </TabsList>

              <span className="text-xs text-slate-500 font-mono">
                RBAC Level: Tier 1 Security Policy
              </span>
            </div>

            {/* TAB 1: USERS & ROLES TABLE */}
            <TabsContent value="users" className="space-y-4 mt-0">
              <Card className="shadow-none border-slate-200 bg-white">
                <CardHeader className="p-4 border-b border-slate-200 flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle className="text-sm font-semibold text-slate-900">
                      System Users & Role-Based Access Control
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 mt-0.5">
                      Manage credentials, role assignments, and regional hub authorizations.
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsInviteModalOpen(true)}
                    className="h-7 text-xs border-slate-200"
                  >
                    + Add New Record
                  </Button>
                </CardHeader>

                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-slate-50/75">
                      <TableRow className="border-b border-slate-200">
                        <TableHead className="text-xs font-semibold text-slate-600 py-2.5 w-[180px]">
                          User Name
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-slate-600 py-2.5">
                          Email Address
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-slate-600 py-2.5 w-[130px]">
                          Role
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-slate-600 py-2.5 w-[200px]">
                          Assigned Terminal / Hub
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-slate-600 py-2.5 text-center w-[110px]">
                          Status
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-slate-600 py-2.5 text-right w-[160px]">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => {
                        // Badge styling based on role
                        let roleBadge = "bg-slate-100 text-slate-700 border-slate-200";
                        if (user.role === "Admin") roleBadge = "bg-purple-50 text-purple-700 border-purple-200";
                        if (user.role === "Dispatcher") roleBadge = "bg-blue-50 text-blue-700 border-blue-200";
                        if (user.role === "Auditor") roleBadge = "bg-indigo-50 text-indigo-700 border-indigo-200";
                        if (user.role === "Accounts") roleBadge = "bg-emerald-50 text-emerald-700 border-emerald-200";
                        if (user.role === "Client AP") roleBadge = "bg-amber-50 text-amber-800 border-amber-300";
                        if (user.role === "Driver") roleBadge = "bg-slate-100 text-slate-800 border-slate-300";

                        return (
                          <TableRow
                            key={user.id}
                            className={`border-b border-slate-200 text-xs transition-colors ${
                              user.status === "Deactivated" ? "opacity-60 bg-slate-50/50" : "hover:bg-slate-50/70"
                            }`}
                          >
                            {/* Name */}
                            <TableCell className="py-2.5">
                              <div className="font-semibold text-slate-900">{user.name}</div>
                              <span className="text-[10px] text-slate-600 font-mono">{user.id}</span>
                            </TableCell>

                            {/* Email */}
                            <TableCell className="py-2.5 font-mono text-slate-700">
                              {user.email}
                            </TableCell>

                            {/* Role Badge */}
                            <TableCell className="py-2.5">
                              <Badge variant="outline" className={`text-[10px] font-semibold px-2 py-0.5 rounded ${roleBadge}`}>
                                {user.role}
                              </Badge>
                            </TableCell>

                            {/* Hub */}
                            <TableCell className="py-2.5 text-slate-600 truncate max-w-[200px]">
                              {user.hub}
                            </TableCell>

                            {/* Status */}
                            <TableCell className="py-2.5 text-center">
                              <Badge
                                variant="outline"
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                                  user.status === "Active"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : user.status === "Invited"
                                    ? "bg-amber-50 text-amber-800 border-amber-200"
                                    : "bg-red-50 text-red-700 border-red-200"
                                }`}
                              >
                                {user.status}
                              </Badge>
                            </TableCell>

                            {/* Action Buttons */}
                            <TableCell className="py-2.5 text-right">
                              <div className="flex items-center justify-end space-x-1.5">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => alert(`Editing master profile for ${user.name} (${user.id})`)}
                                  className="h-7 text-[11px] px-2.5 border-slate-200 text-slate-700 hover:bg-slate-100"
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleToggleDeactivate(user.id)}
                                  className={`h-7 text-[11px] px-2.5 border ${
                                    user.status === "Deactivated"
                                      ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                                      : "border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200"
                                  }`}
                                >
                                  {user.status === "Deactivated" ? "Activate" : "Deactivate"}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>

                <div className="p-3 bg-slate-50/50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Showing {filteredUsers.length} of {users.length} registered system users</span>
                  <span className="font-mono">Security Hash: SHA-256 RBAC Verified</span>
                </div>
              </Card>
            </TabsContent>

            {/* TAB 2: VEHICLES MASTER */}
            <TabsContent value="vehicles" className="space-y-4 mt-0">
              <Card className="shadow-none border-slate-200 bg-white">
                <CardHeader className="p-4 border-b border-slate-200 flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle className="text-sm font-semibold text-slate-900">
                      Fleet Vehicles Master Registry
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 mt-0.5">
                      Commercial vehicle registration, tonnage specifications, and driver assignments.
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 text-xs border-slate-200">
                    + Register Truck
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-slate-50/75">
                      <TableRow className="border-b border-slate-200">
                        <TableHead className="py-2.5 text-xs font-semibold text-slate-600">Reg Number</TableHead>
                        <TableHead className="py-2.5 text-xs font-semibold text-slate-600">Make & Model</TableHead>
                        <TableHead className="py-2.5 text-xs font-semibold text-slate-600">Payload Tonnage</TableHead>
                        <TableHead className="py-2.5 text-xs font-semibold text-slate-600">Assigned Driver</TableHead>
                        <TableHead className="py-2.5 text-xs font-semibold text-slate-600 text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {INITIAL_VEHICLES.map((v) => (
                        <TableRow key={v.regNo} className="border-b border-slate-200 text-xs">
                          <TableCell className="font-mono font-bold text-slate-900">{v.regNo}</TableCell>
                          <TableCell className="text-slate-800">{v.makeModel}</TableCell>
                          <TableCell className="font-mono text-slate-700">{v.tonnage}</TableCell>
                          <TableCell className="text-slate-800">{v.assignedDriver}</TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant="outline"
                              className={`text-[10px] font-semibold ${
                                v.status === "In Fleet"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-amber-50 text-amber-800 border-amber-300"
                              }`}
                            >
                              {v.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 3: DRIVERS MASTER */}
            <TabsContent value="drivers" className="space-y-4 mt-0">
              <Card className="shadow-none border-slate-200 bg-white">
                <CardHeader className="p-4 border-b border-slate-200 flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle className="text-sm font-semibold text-slate-900">
                      Certified Drivers Directory
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 mt-0.5">
                      Commercial heavy transport driver licenses, duty status, and truck pairings.
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 text-xs border-slate-200">
                    + Onboard Driver
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-slate-50/75">
                      <TableRow className="border-b border-slate-200">
                        <TableHead className="py-2.5 text-xs font-semibold text-slate-600">Driver ID & Name</TableHead>
                        <TableHead className="py-2.5 text-xs font-semibold text-slate-600">Contact Number</TableHead>
                        <TableHead className="py-2.5 text-xs font-semibold text-slate-600">Heavy Vehicle License</TableHead>
                        <TableHead className="py-2.5 text-xs font-semibold text-slate-600">Assigned Truck</TableHead>
                        <TableHead className="py-2.5 text-xs font-semibold text-slate-600 text-center">Duty Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {INITIAL_DRIVERS.map((d) => (
                        <TableRow key={d.id} className="border-b border-slate-200 text-xs">
                          <TableCell>
                            <span className="font-semibold text-slate-900 block">{d.name}</span>
                            <span className="text-[10px] text-slate-600 font-mono">{d.id}</span>
                          </TableCell>
                          <TableCell className="font-mono text-slate-700">{d.phone}</TableCell>
                          <TableCell className="font-mono text-slate-800">{d.licenseNo}</TableCell>
                          <TableCell className="font-mono text-slate-900 font-bold">{d.assignedTruck}</TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant="outline"
                              className={`text-[10px] font-semibold ${
                                d.status === "On Route"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : d.status === "Available"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-slate-100 text-slate-700 border-slate-300"
                              }`}
                            >
                              {d.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* 4. "INVITE USER" MODAL (DIALOG COMPONENT) */}
      <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden border-slate-200 shadow-xl">
          <DialogHeader className="p-5 border-b border-slate-200 bg-slate-50/80">
            <div className="flex items-center space-x-2">
              <UserPlus className="h-4 w-4 text-blue-800" />
              <DialogTitle className="text-base font-bold text-slate-900">
                Invite New System User
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-slate-500 mt-1">
              Send an enterprise invitation link for password setup and terminal assignment.
            </DialogDescription>
          </DialogHeader>

          {/* Form Content */}
          <form onSubmit={handleSendInvite}>
            <div className="p-5 space-y-3.5">
              {/* Invite Link Generated Banner */}
              {generatedInviteLink && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-md text-emerald-950 space-y-1.5 animate-in fade-in-50">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Invitation Link Generated!
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input
                      readOnly
                      value={generatedInviteLink}
                      className="h-7 text-[11px] font-mono bg-white border-emerald-200 text-slate-800"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => copyToClipboard(generatedInviteLink)}
                      className="h-7 text-xs px-2.5 bg-emerald-700 hover:bg-emerald-800 text-white"
                    >
                      <Copy className="h-3 w-3 mr-1" /> Copy
                    </Button>
                  </div>
                  <p className="text-[10px] text-emerald-800 font-sans">
                    User record added with status &quot;Invited&quot;. Link expires in 48 hours.
                  </p>
                </div>
              )}

              {/* Full Name */}
              <div className="space-y-1">
                <Label htmlFor="inviteName" className="text-xs font-semibold text-slate-700">
                  Full Name *
                </Label>
                <Input
                  id="inviteName"
                  placeholder="e.g. Anand Murthy"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  required
                  className="h-9 text-xs border-slate-200"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <Label htmlFor="inviteEmail" className="text-xs font-semibold text-slate-700">
                  Corporate Email Address *
                </Label>
                <Input
                  id="inviteEmail"
                  type="email"
                  placeholder="name@vectologistics.in"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                  className="h-9 text-xs border-slate-200"
                />
              </div>

              {/* Role Dropdown */}
              <div className="space-y-1">
                <Label htmlFor="inviteRole" className="text-xs font-semibold text-slate-700">
                  Assigned RBAC Role *
                </Label>
                <select
                  id="inviteRole"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as UserRole)}
                  className="w-full h-9 text-xs rounded-md border border-slate-200 bg-white px-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-950 font-medium"
                >
                  <option value="Dispatcher">Dispatcher (Live fleet telematics & EOD closure)</option>
                  <option value="Auditor">Auditor (Split-pane POD inspection & variance checks)</option>
                  <option value="Accounts">Accounts & Billing (GST invoicing & AR aging)</option>
                  <option value="Client AP">Client AP (External consignee invoice review)</option>
                  <option value="Driver">Driver (Mobile GPS HUD & digital signature)</option>
                  <option value="Admin">Admin (Full Master Data & user provisioning)</option>
                </select>
              </div>

              {/* Hub / Terminal */}
              <div className="space-y-1">
                <Label htmlFor="inviteHub" className="text-xs font-semibold text-slate-700">
                  Assigned Regional Terminal / Hub
                </Label>
                <Input
                  id="inviteHub"
                  placeholder="e.g. Bhiwandi Hub #4"
                  value={inviteHub}
                  onChange={(e) => setInviteHub(e.target.value)}
                  className="h-9 text-xs border-slate-200"
                />
              </div>
            </div>

            <DialogFooter className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCloseInviteModal}
                className="h-8 text-xs border-slate-200 text-slate-700"
              >
                {generatedInviteLink ? "Done" : "Cancel"}
              </Button>
              {!generatedInviteLink && (
                <Button
                  type="submit"
                  size="sm"
                  className="h-8 text-xs bg-blue-800 hover:bg-blue-900 text-white font-semibold shadow-xs"
                >
                  Send Invitation
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

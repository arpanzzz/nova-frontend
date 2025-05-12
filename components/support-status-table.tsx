"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface CallLogEntry {
  Call_Id?: string
  CallAssignTo?: string
  AssetCode?: string
  AssetType?: string
  IssueType?: string
  CallRegDate?: string
  IssueDetails?: string
  CallStatus?: string
}

export default function SupportStatusTable() {
  const [callLogs, setCallLogs] = useState<CallLogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("All")

  useEffect(() => {
    const fetchCallLogs = async () => {
      const token = sessionStorage.getItem("token")
      if (!token) return

      try {
        const res = await fetch("http://localhost:4000/manage-call-log/call", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()
        console.log("API Response: ", data)
        if (Array.isArray(data)) {
          setCallLogs(data)
        } else {
          console.error("Unexpected API response format", data)
          setCallLogs([])
        }
      } catch (error) {
        console.error("Failed to fetch call logs", error)
        setCallLogs([])
      } finally {
        setLoading(false)
      }
    }

    fetchCallLogs()
    const interval = setInterval(fetchCallLogs, 30000) // refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  // Filtered logs based on selected status
  const filteredLogs = statusFilter === "All"
    ? callLogs
    : callLogs.filter((entry) => entry.CallStatus === statusFilter)

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Support Request Status</h3>
        <p className="text-sm text-muted-foreground">
          Track the status of your submitted support queries.
        </p>
      </div>

      {/* Dropdown filter for Call Status */}
      <div className="flex justify-end mb-2">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1 text-sm"
        >
          <option value="All">All</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <Card className="min-w-[1000px] w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Asset Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Issue</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    No support tickets found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((entry) => (
                  <TableRow key={entry.Call_Id}>
                    <TableCell className="font-medium">{entry.Call_Id || "—"}</TableCell>
                    <TableCell>{entry.CallAssignTo?.trim() || "—"}</TableCell>
                    <TableCell>{entry.AssetCode?.trim() || "—"}</TableCell>
                    <TableCell>{entry.AssetType || "—"}</TableCell>
                    <TableCell>{entry.IssueType || "—"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {entry.CallRegDate ? new Date(entry.CallRegDate).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {entry.IssueDetails || "—"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          entry.CallStatus === "Open"
                            ? "bg-gray-100 text-gray-700"
                            : entry.CallStatus === "In Progress"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {entry.CallStatus || "—"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
}

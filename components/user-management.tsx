"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"
import { toast } from "sonner"

const dummyEmployees = Array.from({ length: 20 }).map((_, i) => ({
  id: `EMP-${1000 + i}`,
  name: `Employee ${i + 1}`,
  department: ["HR", "IT", "Finance", "Operations"][i % 4],
  role: ["Manager", "Analyst", "Developer"][i % 3],
  deviceCount: (i % 4) + 1,
  deviceIds: Array.from({ length: (i % 4) + 1 }).map((_, j) => `DEV-${i}${j}`),
  status: ["Working", "On Leave", "Notice Period"][i % 3],
}))

export default function UserManagementTable() {
  const [search, setSearch] = useState("")
  const [employees, setEmployees] = useState(dummyEmployees)
  const [selected, setSelected] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [form, setForm] = useState({})
  const [page, setPage] = useState(1)
  const itemsPerPage = 10

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.id.toLowerCase().includes(search.toLowerCase()) ||
      emp.department.toLowerCase().includes(search.toLowerCase()) ||
      emp.role.toLowerCase().includes(search.toLowerCase()) ||
      emp.status.toLowerCase().includes(search.toLowerCase()) ||
      emp.deviceIds.some((d) => d.toLowerCase().includes(search.toLowerCase()))
  )

  const pageCount = Math.ceil(filteredEmployees.length / itemsPerPage)
  const paginatedEmployees = filteredEmployees.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  const handleUpdateClick = (emp) => {
    setSelected(emp)
    setForm({ ...emp, deviceIds: emp.deviceIds.join(", ") })
    setDialogOpen(true)
  }

  const handleConfirmUpdate = () => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === form.id ? { ...form, deviceIds: form.deviceIds.split(",").map((d) => d.trim()) } : e))
    )
    setConfirmOpen(false)
    setDialogOpen(false)
    toast.success("Changes have been saved.")
  }

  const handleAddEmployee = () => {
    const newId = `EMP-${1000 + employees.length}`
    const newEmployee = {
      ...form,
      id: newId,
      deviceCount: form.deviceIds.split(",").length,
      deviceIds: form.deviceIds.split(",").map((d) => d.trim()),
    }
    setEmployees((prev) => [...prev, newEmployee])
    setDialogOpen(false)
    toast.success("Employee added successfully.")
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">User Management</h3>
          <p className="text-sm text-muted-foreground">Manage employee records and their device assignments.</p>
        </div>
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Search by any field..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <Button onClick={() => { setForm({}); setDialogOpen(true); }}>Add</Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Card className="rounded-2xl min-w-[1000px] w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>No. of Devices</TableHead>
                <TableHead>Device IDs</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedEmployees.length > 0 ? (
                paginatedEmployees.map((emp) => (
                  <TableRow key={emp.id} className="group hover:bg-muted/40 transition-colors duration-200 ease-in-out">
                    <TableCell>{emp.id}</TableCell>
                    <TableCell>{emp.name}</TableCell>
                    <TableCell>{emp.department}</TableCell>
                    <TableCell>{emp.role}</TableCell>
                    <TableCell>{emp.deviceCount}</TableCell>
                    <TableCell>{emp.deviceIds.join(", ")}</TableCell>
                    <TableCell>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full transition-colors duration-300 ease-in-out
                        ${emp.status === "Working"
                          ? "bg-green-100 text-green-700 group-hover:bg-green-200"
                          : emp.status === "On Leave"
                          ? "bg-yellow-100 text-yellow-700 group-hover:bg-yellow-200"
                          : "bg-red-100 text-red-700 group-hover:bg-red-200"}`}>
                        {emp.status}
                      </span>
                    </TableCell>
                    <TableCell className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out">
                      <Button size="sm" onClick={() => handleUpdateClick(emp)}>
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    No employees found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Pagination */}
      <div className="flex justify-end gap-4 pt-4">
        <Button variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Previous
        </Button>
        <span className="self-center text-sm">Page {page} of {pageCount}</span>
        <Button variant="outline" disabled={page >= pageCount} onClick={() => setPage(page + 1)}>
          Next
        </Button>
      </div>

      {/* Add/Update Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{form.id ? "Update Employee" : "Add Employee"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" />
            <Input value={form.department || ""} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="Department" />
            <Input value={form.role || ""} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Role" />
            <Input type="number" value={form.deviceCount || 0} onChange={(e) => setForm({ ...form, deviceCount: parseInt(e.target.value) })} placeholder="Device Count" />
            <Input value={form.deviceIds || ""} onChange={(e) => setForm({ ...form, deviceIds: e.target.value })} placeholder="Device IDs (comma separated)" />
            <Select value={form.status || ""} onValueChange={(val) => setForm({ ...form, status: val })}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Working">Working</SelectItem>
                <SelectItem value="On Leave">On Leave</SelectItem>
                <SelectItem value="Notice Period">Notice Period</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button onClick={() => form.id ? setConfirmOpen(true) : handleAddEmployee()}>{form.id ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Dialog */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to update this employee?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmUpdate}>Yes, update</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

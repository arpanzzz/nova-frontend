"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Employee = {
  EmpRecID: number;
  EmpNo: string;
  EmpName: string;
  EmpCompID: string;
  EmpDeptID: string;
  EmpContNo: string | null;
  IsActive: number | null;
  Username: string | null;
  Password: any; // could be string | { type: "Buffer"; data: number[] }
  LastLogin: string | null;
  LastLocation: string | null;
  IsAdmin: boolean | null;
};

const ITEMS_PER_PAGE = 10;

export default function UserManagementTable({ refreshKey }: { refreshKey: number }) {
  const [users, setUsers] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Employee | null>(null);
  const [formState, setFormState] = useState<Partial<Employee>>({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await fetch("http://localhost:4000/manage-user/get-all-users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    fetchUsers();
  }, [refreshKey]);

  const handleOpenDialog = (user: Employee) => {
    setSelectedUser(user);
    setFormState({
      ...user,
      Password: formatPassword(user.Password),
    });
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    if (!selectedUser) return;
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(`http://localhost:4000/manage-user/update-user/${selectedUser.EmpRecID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formState),
      });

      if (response.ok) {
        toast.success("User updated successfully");
        setOpenDialog(false);
      } else {
        toast.error("Failed to update user");
      }
    } catch (err) {
      console.error("Error updating user", err);
      toast.error("Internal server error");
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(`http://localhost:4000/manage-user/delete-user/${selectedUser.EmpRecID}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("User deleted successfully");
        setUsers(users.filter((u) => u.EmpRecID !== selectedUser.EmpRecID));
        setOpenDialog(false);
      } else {
        toast.error("Failed to delete user");
      }
    } catch (err) {
      console.error("Error deleting user", err);
      toast.error("Internal server error");
    }
  };

  const formatPassword = (val: any) => {
    if (val && val.type === "Buffer" && Array.isArray(val.data)) {
      return String.fromCharCode(...val.data);
    }
    return val ?? "";
  };

  const displayValue = (key: string, val: any) => {
    if (key === "Password") return formatPassword(val);
    if (key === "IsAdmin") return val ? "Yes" : "No";
    if (val === null || val === undefined) return "";
    return val.toString();
  };

  const filteredUsers = users.filter((user) =>
    Object.values(user).some((val) =>
      formatPassword(val)?.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <Card className="w-full max-w-6xl mx-auto my-10 px-4 py-8 space-y-4">
      <div className="flex justify-between items-center m-4">
        <h2 className="text-xl font-semibold">User Management</h2>
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-1/3"
        />
      </div>

      <div className="overflow-auto">
        <Table className="text-sm">
          <TableHeader>
            <TableRow className="bg-gray-100">
              {Object.keys(users[0] || {}).map((key) => (
                <TableHead key={key} className="min-w-[120px] whitespace-nowrap">
                  {key}
                </TableHead>
              ))}
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.map((user, index) => (
              <TableRow key={user.EmpRecID} className={index % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100"}>
                {Object.entries(user).map(([key, val]) => (
                  <TableCell key={key} className="whitespace-nowrap">{displayValue(key, val)}</TableCell>
                ))}
                <TableCell>
                  <Button onClick={() => handleOpenDialog(user)} size="sm">
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {paginatedUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={Object.keys(users[0] || {}).length + 1} className="text-center">
                  No matching users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <Button
          variant="outline"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="w-full max-w-6xl mx-auto px-4 py-8 space-y-4">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">Update User</DialogTitle>
          </DialogHeader>

          {selectedUser ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[65vh] overflow-y-auto pr-2 mt-4">
              {Object.entries(formState).map(([key, value]) => (
                <div key={key} className="flex flex-col gap-2">
                  <Label className="text-sm text-muted-foreground capitalize">{key}</Label>
                  <Input
                    value={value as string}
                    onChange={(e) => setFormState({ ...formState, [key]: e.target.value })}
                    className="w-full"
                  />
                </div>
              ))}
              <div className="col-span-full flex justify-end gap-4 mt-6">
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
                <Button onClick={handleSubmit}>Submit</Button>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground mt-4">No user selected.</p>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}

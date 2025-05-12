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

type Asset = {
  AssetCode: string;
  AssetERP_Code: string;
  AssetType: string;
  AssetDescription: string;
  PurchaseDate: string;
  OwnerCompany: string;
  PurchaseEmployeeName: string;
  PoNo: string;
  PoDate: string;
  PurchasedPrice: number;
  VendorName: string;
  WarrantyDate: string;
  IsIssued: number;
  UserContNo: string;
  UserCompany: string;
  IssuedDate: string;
  IssuedSite: string;
  IsActive: number;
  IsScrraped: boolean;
  ScrapedDate: string;
  Remarks1: string;
  Remarks2: string;
  Remarks3: string;
  AssetBrand: string;
  AssetModel: string;
  AssetSlno: string;
  Location: string;
};

const ITEMS_PER_PAGE = 10;

export default function AssetManagementTable({ refreshKey }: { refreshKey: number }) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [formState, setFormState] = useState<Partial<Asset>>({});

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await fetch("http://localhost:4000/manage-asset/get-assets", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setAssets(data);
      } catch (err) {
        console.error("Failed to fetch assets", err);
      }
    };

    fetchAssets();
  }, [ refreshKey]);

  const handleOpenDialog = (asset: Asset) => {
    setSelectedAsset(asset);
    setFormState(asset);
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    if (!selectedAsset) return;
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(`http://localhost:4000/manage-asset/update-asset/${selectedAsset.AssetCode}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formState),
      });

      if (response.ok) {
        toast.success("Asset updated successfully");
        setOpenDialog(false);
      } else {
        toast.error("Failed to update asset");
      }
    } catch (err) {
      console.error("Error updating asset", err);
      toast.error("Internal server error");
    }
  };

  const handleDelete = async () => {
    if (!selectedAsset) return;
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(`http://localhost:4000/manage-asset/delete-asset/${selectedAsset.AssetCode}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Asset deleted successfully");
        setAssets(assets.filter((a) => a.AssetCode !== selectedAsset.AssetCode));
        setOpenDialog(false);
      } else {
        toast.error("Failed to delete asset");
      }
    } catch (err) {
      console.error("Error deleting asset", err);
      toast.error("Internal server error");
    }
  };

  const filteredAssets = assets.filter((asset) =>
    Object.values(asset).some((val) =>
      val?.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredAssets.length / ITEMS_PER_PAGE);
  const paginatedAssets = filteredAssets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <Card className="w-full max-w-6xl mx-auto my-10 px-4 py-8 space-y-4">
      <div className="flex justify-between items-center m-4">
        <h2 className="text-xl font-semibold">Asset Management</h2>
        <Input
          placeholder="Search assets..."
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
              {Object.keys(assets[0] || {}).map((key) => (
                <TableHead key={key} className="min-w-[120px] whitespace-nowrap">
                  {key}
                </TableHead>
              ))}
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedAssets.map((asset, index) => (
              <TableRow key={asset.AssetCode} className={index % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100"}>
                {Object.entries(asset).map(([key, val]) => (
                  <TableCell key={key} className="whitespace-nowrap">{val as string}</TableCell>
                ))}
                <TableCell>
                  <Button onClick={() => handleOpenDialog(asset)} size="sm">
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {paginatedAssets.length === 0 && (
              <TableRow>
                <TableCell colSpan={Object.keys(assets[0] || {}).length + 1} className="text-center">
                  No matching assets found.
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
          <DialogTitle className="text-2xl font-semibold">Update Asset</DialogTitle>
        </DialogHeader>

        {selectedAsset ? (
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
          <p className="text-muted-foreground mt-4">No asset selected.</p>
        )}
      </DialogContent>
    </Dialog>
    </Card>
  );
}

"use client";

import React, { useState } from "react";
import { Layers, Plus, Search, Tag, X, Check, Trash2 } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import {
  AdminTable,
  AdminTableHeader,
  AdminTableHead,
  AdminTableBody,
  AdminTableRow,
  AdminTableCell,
  AdminTableToggle,
  AdminTableEmpty,
} from "@/components/admin/AdminTable";

export default function AdminCategoriesPage() {
  const { categories, addCategory, toggleCategoryStatus } = useAdmin();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [categoryName, setCategoryName] = useState("");
  const [subcategoriesInput, setSubcategoriesInput] = useState("");

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    const subcats = subcategoriesInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    addCategory(categoryName.trim(), subcats);
    setCategoryName("");
    setSubcategoriesInput("");
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 shadow-2xs mt-0.5">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Inventory Categories & Taxonomies
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Organize loom archives, weave clusters, subcategories, and storefront navigation menus.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-semibold shadow-xs transition-all hover:shadow-md cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search category name..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-cyan-500 shadow-2xs"
          />
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Total Categories: <strong className="text-slate-800">{categories.length}</strong>
        </div>
      </div>

      {/* Categories Table using Common AdminTable */}
      <AdminTable>
        <AdminTableHeader>
          <AdminTableHead>Category Name</AdminTableHead>
          <AdminTableHead>Slug</AdminTableHead>
          <AdminTableHead>Subcategories & Weaves</AdminTableHead>
          <AdminTableHead>Catalog Count</AdminTableHead>
          <AdminTableHead>Status</AdminTableHead>
        </AdminTableHeader>

        <AdminTableBody>
          {filteredCategories.length === 0 ? (
            <AdminTableEmpty
              title="No categories found"
              message="No weave categories match your search."
              colSpan={5}
            />
          ) : (
            filteredCategories.map((cat) => (
              <AdminTableRow key={cat.id}>
                <AdminTableCell>
                  <span className="font-bold text-slate-900 text-sm">{cat.name}</span>
                </AdminTableCell>
                <AdminTableCell className="font-mono text-slate-500">
                  /{cat.slug}
                </AdminTableCell>
                <AdminTableCell>
                  <div className="flex flex-wrap gap-1.5 max-w-md">
                    {cat.subcategories.map((sub, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </AdminTableCell>
                <AdminTableCell className="font-semibold text-slate-800">
                  {cat.itemCount} drapes
                </AdminTableCell>
                <AdminTableCell>
                  <AdminTableToggle
                    active={cat.isActive}
                    onToggle={() => toggleCategoryStatus(cat.id)}
                  />
                </AdminTableCell>
              </AdminTableRow>
            ))
          )}
        </AdminTableBody>
      </AdminTable>

      {/* Modal Dialog for Add Category */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-slate-900 text-base">Add New Category</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Category Title</label>
                <input
                  type="text"
                  required
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g. Bridal Lehengas & Drapes"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-hidden focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Subcategories (comma separated)
                </label>
                <textarea
                  rows={3}
                  value={subcategoriesInput}
                  onChange={(e) => setSubcategoriesInput(e.target.value)}
                  placeholder="e.g. Tissue Gold Zari, Katan Pure Silk, Organza Sheer"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs focus:outline-hidden focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white font-semibold cursor-pointer shadow-xs"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

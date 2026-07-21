import { NextRequest, NextResponse } from "next/server";
import { getStore, saveStore, addAuditLog, Category } from "@/lib/db";
import { validateAdminRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  if (!validateAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const store = getStore();
  return NextResponse.json(store.categories);
}

export async function POST(req: NextRequest) {
  if (!validateAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const catData: Omit<Category, "id"> = await req.json();
    const store = getStore();

    const newCategory: Category = {
      ...catData,
      id: "cat-" + Math.random().toString(36).substring(2, 9),
    };

    store.categories = [...store.categories, newCategory];
    saveStore(store);

    addAuditLog("Category Created", `Created category: "${newCategory.name}"`);
    return NextResponse.json(newCategory);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!validateAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const updatedCategory: Category = await req.json();
    const store = getStore();

    const index = store.categories.findIndex((c) => c.id === updatedCategory.id);
    if (index === -1) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    store.categories[index] = updatedCategory;
    saveStore(store);

    addAuditLog("Category Updated", `Updated category: "${updatedCategory.name}"`);
    return NextResponse.json(updatedCategory);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!validateAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const store = getStore();
    const category = store.categories.find((c) => c.id === id);
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    store.categories = store.categories.filter((c) => c.id !== id);
    saveStore(store);

    addAuditLog("Category Deleted", `Deleted category: "${category.name}"`);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}

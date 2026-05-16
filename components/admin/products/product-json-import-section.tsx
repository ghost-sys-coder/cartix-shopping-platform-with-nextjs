"use client";

import Link from "next/link";
import { type ChangeEvent, useRef, useState } from "react";
import { Download, FileJson, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type {
  ProductFormImage,
  ProductFormState,
} from "@/components/admin/products/product-form-types";
import { mapProductPayloadToFormValues } from "@/lib/products/product-input";

interface ProductJsonImportSectionProps {
  onImport: (values: {
    form: ProductFormState;
    images: ProductFormImage[];
  }) => void;
  onError: (message: string) => void;
}

function parseJsonObject(value: string) {
  const parsed = JSON.parse(value) as unknown;
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Product JSON must be a single object");
  }
  return parsed as Record<string, unknown>;
}

export function ProductJsonImportSection({
  onImport,
  onError,
}: ProductJsonImportSectionProps) {
  const [jsonText, setJsonText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function importJson(value: string) {
    try {
      const payload = parseJsonObject(value);
      const result = mapProductPayloadToFormValues(payload);

      if (!result.ok) {
        throw new Error(result.error);
      }

      onImport(result.values);
      toast.success("Product JSON imported");
    } catch (error) {
      onError(
        error instanceof Error ? error.message : "Failed to import product JSON"
      );
    }
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    await importJson(await file.text());
  }

  async function handlePasteImport() {
    if (!jsonText.trim()) {
      onError("Paste product JSON before importing");
      return;
    }

    await importJson(jsonText);
  }

  return (
    <section className="p-5 rounded-[var(--radius-auth)] border border-border bg-card space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FileJson size={17} className="text-muted-foreground" />
            <h2 className="font-headline font-bold">Import Product JSON</h2>
          </div>
        </div>
        <Button asChild variant="outline" size="sm" className="gap-2">
          <Link href="/samples/product-import-sample.json" download>
            <Download size={14} />
            Sample JSON
          </Link>
        </Button>
      </div>

      <div>
        <label className="block text-xs font-label font-semibold text-muted-foreground mb-1.5">
          Product JSON
        </label>
        <textarea
          value={jsonText}
          onChange={(event) => setJsonText(event.target.value)}
          rows={7}
          placeholder='{"name":"Premium Wireless Headphones","price":249.99}'
          className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono resize-y"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          onClick={handlePasteImport}
        >
          <FileJson size={15} />
          Paste JSON
        </Button>
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={15} />
          Upload JSON
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          aria-label="Upload product JSON"
          onChange={handleFileChange}
        />
      </div>
    </section>
  );
}

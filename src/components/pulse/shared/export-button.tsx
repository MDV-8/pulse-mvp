'use client';

import React from 'react';
import { Download, Copy, Printer } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface ExportButtonProps {
  title: string;
  headers: string[];
  rows: string[][];
}

export function ExportButton({ title, headers, rows }: ExportButtonProps) {
  const generateCSV = () => {
    const csvRows = [headers.join(',')];
    for (const row of rows) {
      csvRows.push(row.map((cell) => `"${cell}"`).join(','));
    }
    return csvRows.join('\n');
  };

  const handleDownloadCSV = () => {
    const csv = '\uFEFF' + generateCSV(); // BOM for Excel UTF-8
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: 'Файл скачан',
      description: `${title} экспортирован в CSV`,
    });
  };

  const handleCopy = async () => {
    const text = [headers.join('\t'), ...rows.map((r) => r.join('\t'))].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Скопировано',
        description: 'Данные скопированы в буфер обмена',
      });
    } catch {
      toast({
        title: 'Ошибка',
        description: 'Не удалось скопировать данные',
        variant: 'destructive',
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs h-8"
        >
          <Download className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Экспорт</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem onClick={handleDownloadCSV} className="gap-2 cursor-pointer">
          <Download className="h-4 w-4" />
          Скачать Excel (CSV)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopy} className="gap-2 cursor-pointer">
          <Copy className="h-4 w-4" />
          Скопировать данные
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handlePrint} className="gap-2 cursor-pointer">
          <Printer className="h-4 w-4" />
          Распечатать
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

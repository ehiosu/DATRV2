import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { Input } from "./input";
import { PaginationEllipsis } from "./pagination";
type paginationProps = {
  className?: string;
  maxPage: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
};

export const NcPagination: React.FC<paginationProps> = ({
  className,
  maxPage,
  setPage,
  currentPage,
}) => {
  const [targetPage, setTargetPage] = useState<number | null>(null);

  return (
    <div className={cn("flex items-center flex-wrap", className)}>
      <button
        disabled={currentPage === 1}
        onClick={() => setPage((state) => Math.max(state - 1, 1))}
        className="w-8 h-8 rounded bg-ncBlue text-white flex items-center justify-center mr-2 disabled:bg-slate-300 disabled:text-black"
      >
        <ChevronLeft className="w-4 h-4 shrink" />
      </button>

      {Array.from({ length: Math.min(maxPage, 7) }).map((_, index) => {
        const pageNumber = index + 1;
        const isVisible =
          (currentPage <= 3 && pageNumber <= 3) ||
          (currentPage >= maxPage - 2 && pageNumber >= maxPage - 2) ||
          (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1);

        return isVisible ? (
          <button
            key={pageNumber}
            onClick={() => setPage(pageNumber)}
            className={`w-7 h-7 rounded ${
              pageNumber === currentPage
                ? "bg-ncBlue text-white"
                : "bg-white text-ncBlue ring-2 ring-ncBlue hover:bg-slate-200/40 transition-colors"
            } flex items-center justify-center mr-2`}
          >
            {pageNumber}
          </button>
        ) : null;
      })}

      <div className="flex items-center ml-3 text-sm md:mt-0 mt-2">
        <p>Go To Page</p>
        <Input
          value={targetPage || ""}
          className="w-8 h-8 border-[1px] ml-2 mr-1 dark:bg-white dark:border-neutral-400 border-neutral-400 transition-all focus:border-darkBlue px-1"
          max={maxPage}
          placeholder="1"
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            if (!e.target.value) {
              setTargetPage(null);
            } else {
              if (value <= maxPage) {
                setTargetPage(value);
              }
            }
          }}
          type="number"
        />
        <p>/ {maxPage}</p>
        <button
          className="w-max px-1.5 py-2 bg-ncBlue text-white rounded-md mx-2 disabled:bg-slate-300 disabled:text-black"
          disabled={!targetPage}
          onClick={() => {
            setPage(targetPage as number);
            setTargetPage(null);
          }}
        >
          Submit
        </button>
      </div>

      <button
        onClick={() => setPage((state) => Math.min(state + 1, maxPage))}
        className="w-8 h-8 rounded bg-ncBlue text-white flex items-center justify-center ml-2 disabled:bg-slate-300 disabled:text-black md:mt-0 mt-2"
      >
        <ChevronRight className="w-4 h-4 shrink" />
      </button>
    </div>
  );
};

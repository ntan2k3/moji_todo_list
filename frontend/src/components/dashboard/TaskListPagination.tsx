import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

type TaskListPaginationProps = {
  handleNext: () => void;
  handlePre: () => void;
  handlePageChange: (page: number) => void;
  page: number;
  totalPage: number;
};

const TaskListPagination = ({
  handleNext,
  handlePre,
  handlePageChange,
  page,
  totalPage,
}: TaskListPaginationProps) => {
  const generatePages = () => {
    const pages: (number | "...")[] = [];
    if (totalPage < 4) {
      for (let i = 1; i <= totalPage; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 2) {
        pages.push(1, 2, 3, "...", totalPage);
      } else if (page >= totalPage - 1) {
        pages.push(1, "...", totalPage - 2, totalPage - 1, totalPage);
      } else {
        pages.push(1, "...", page, "...", totalPage);
      }
    }
    return pages;
  };

  const pagesToShow = generatePages();

  return (
    <div className="flex justify-center">
      <Pagination>
        <PaginationContent>
          {/* Previous */}
          <PaginationItem>
            <PaginationPrevious
              onClick={page === 1 ? undefined : handlePre}
              className={cn(
                "cursor-pointer",
                page === 1 && "pointer-events-none opacity-40"
              )}
            />
          </PaginationItem>

          {/* Page numbers */}
          {pagesToShow.map((p, index) => (
            <PaginationItem key={index}>
              {p === "..." ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  isActive={p === page}
                  onClick={() => {
                    if (p !== page) handlePageChange(p as number);
                  }}
                >
                  {p}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          {/* Next */}
          <PaginationItem>
            <PaginationNext
              onClick={page === totalPage ? undefined : handleNext}
              className={cn(
                "cursor-pointer",
                page === totalPage && "pointer-events-none opacity-40"
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default TaskListPagination;

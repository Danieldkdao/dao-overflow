import { Button } from "./ui/button";

type PaginationProps = {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalPages: number;
  currentPage: number;
  handlePagination: (dir: "prev" | "next") => void;
};

export const Pagination = ({
  hasNextPage,
  hasPrevPage,
  totalPages,
  currentPage,
  handlePagination,
}: PaginationProps) => {
  return (
    <div className="flex items-center justify-between">
      <p>
        {currentPage} of {totalPages === 0 ? "NA" : totalPages} pages
      </p>
      <div className="flex items-center gap-2">
        <Button disabled={!hasPrevPage} size="sm" onClick={() => handlePagination("prev")}>
          Prev
        </Button>
        <Button size="sm" disabled={!hasNextPage} onClick={() => handlePagination("next")}>
          Next
        </Button>
      </div>
    </div>
  );
};

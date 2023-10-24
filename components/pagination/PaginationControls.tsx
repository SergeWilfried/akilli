import { useRouter } from 'next/navigation';

interface PaginationControlsProps {
  hasPrevPage: boolean;
  hasNextPage: boolean;
  currentPage: number;
  itemsPerPage: number
  count: number
  // task: Task
}
export default function PaginationControls(props: PaginationControlsProps) {
  const { hasNextPage, hasPrevPage, count, currentPage, itemsPerPage } = props;
  const router = useRouter();
  console.warn(`currentPage`, currentPage)
  console.warn(`itemsPerPage`, itemsPerPage)

  return (
    <div className="flex gap-2">
      <button
        className="bg-blue-500 text-white p-1"
        disabled={!hasPrevPage}
        onClick={() => {
          router.push(
            `/?page=${Number(currentPage) - 1}&per_page=${itemsPerPage}`
          );
        }}
      >
        prev page
      </button>

      <div>
        {currentPage} / {Math.ceil(count / Number(itemsPerPage))}
      </div>

      <button
        className="bg-blue-500 text-white p-1"
        disabled={!hasNextPage}
        onClick={() => {
          router.push(
            `/?page=${Number(currentPage) + 1}&per_page=${itemsPerPage}`
          );
        }}
      >
        next page
      </button>
    </div>
  );
}

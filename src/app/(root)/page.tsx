import { HomeFilters } from "@/components/home/home-filters";
import { HomeView } from "@/components/home/home-view";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SearchParams } from "nuqs";

const HomePage = ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  return (
    <div className="py-4">
      <div className="w-full flex items-center gap-2 justify-between flex-wrap">
        <h1 className="text-3xl font-bold">All Questions</h1>
        <Link href="/ask-question">
          <Button>Ask a question</Button>
        </Link>
      </div>
      <HomeFilters />
      <HomeView searchParams={searchParams} />
    </div>
  );
};

export default HomePage;

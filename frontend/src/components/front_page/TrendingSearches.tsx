import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ComputationTrendingSearch,
  QuerySuggestion,
} from "../../shared/ComputationInterface";

const TrendingSearches = () => {
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<QuerySuggestion[]>([]);

  useEffect(() => {
    if (!loading) {
      return;
    }

    const getSuggestions = async () => {
      const latest = await fetch(
        "/api/v1/computations/trendingsearches/latest"
      );
      if (latest.status === 200 || latest.status === 304) {
        const computation: ComputationTrendingSearch = await latest.json();
        setSuggestions(
          computation.suggestions.sort((a, b) => b.score - a.score)
        );
      } else {
        console.error(
          "Failed to get latest trending searches",
          latest.status,
          latest
        );
      }
      setLoading(false);
    };

    getSuggestions().catch(console.error);
  }, [loading]);

  return (
    <>
      <div className="text-lg font-semibold">Suggested Searches</div>
      <div className="">
        {suggestions.map((s) => (
          <Link
            to={"/projects/search?query=" + s.query}
            className="rounded mt-2 mr-2 relative inline-block bg-gray-100 px-4 py-2 text-indigo-700 hover:underline"
            key={s.query}
          >
            <div className="">{s.query}</div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default TrendingSearches;

import Hero from "./Hero";
import TrendingSearches from "./TrendingSearches";

const FrontPage = () => {
  return (
    <>
      <div className="bg-white pt-4 md:pt-12">
        <div className="mx-3 md:mx-8">
          <Hero />
        </div>
      </div>
      <div className="mx-3 my-4 md:mx-8 md:my-12">
        <TrendingSearches />
      </div>
    </>
  );
};

export default FrontPage;

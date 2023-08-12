import SearchResults from "../../components/SearchResults";
import Filters from "./Filters";
import useFilteredData from "./useFilteredData";

const NewsChannels: React.FC = () => {
  const { filteredData, loading, filterState, setFilter } = useFilteredData();
  return (
    <div className="container">
      <Filters filterState={filterState} setFilter={setFilter} />
      <SearchResults
        loading={loading}
        searchResults={filteredData}
        loadingMore={false}
        endReached={true}
        loadMore={async () => []}
      />
    </div>
  );
};

export default NewsChannels;

import SearchForm from "../../components/SearchForm";
import SearchResults from "../../components/SearchResults";
import useYoutubeSearch from "../../helpers/useYoutubeSearch";

const Search: React.FC = () => {
    const {
        loading,
        loadingMore,
        search,
        loadMore,
        searchResults,
        endReached,
    } = useYoutubeSearch(import.meta.env.VITE_GOOGLEAPIS_YT_API_KEY);
    return (
        <div className="container">
            <p className="mt-3 mb-0 p-0">Search for live videos in YouTube</p>
            <SearchForm search={search} loading={loading} />
            <SearchResults
                loading={loading}
                loadingMore={loadingMore}
                searchResults={searchResults}
                endReached={endReached}
                loadMore={loadMore}
            />
        </div>
    );
};

export default Search;

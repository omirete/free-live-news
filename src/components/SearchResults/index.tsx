import { Button } from "react-bootstrap";
import { UseYoutubeSearch } from "../../helpers/useYoutubeSearch";
import Thumbnail, { VideoInfo } from "../Thumbnail";

const SearchResults: React.FC<Omit<UseYoutubeSearch, "search">> = ({
  searchResults,
  endReached,
  loadMore,
  loading,
  loadingMore,
}) => {
  return (
    <div className="mt-3 mb-4 p-2 rounded border shadow-sm">
      {!loading && searchResults && (
        <div className="d-flex flex-row flex-wrap">
          {searchResults.map((searchResult, i) => {
            const videoInfo: VideoInfo = {
              channelTitle: searchResult.snippet.channelTitle,
              channelUrl: `https://www.youtube.com/channel/${searchResult.snippet.channelId}`,
              title: searchResult.snippet.title,
              url: `https://www.youtube.com/watch?v=${searchResult.id.videoId}`,
              description: searchResult.snippet.description,
              publishedAt: searchResult.snippet.publishedAt,
              thumbnailUrl: searchResult.snippet.thumbnails.medium.url,
            };
            return <Thumbnail key={i} {...videoInfo} className="p-1" />;
          })}
        </div>
      )}
      <div className="p-1">
        {loading && <p className="m-0">Loading...</p>}
        {!loading && searchResults.length === 0 && (
          <p className="m-0">No videos.</p>
        )}
        {!loading && !loadingMore && endReached && searchResults.length > 0 && (
          <p className="m-0">End reached.</p>
        )}
        {!loading && !endReached && searchResults.length > 0 && (
          <Button
            onClick={async () => {
              await loadMore();
            }}
            className="w-100 mt-1"
            variant="outline-primary"
            disabled={loadingMore}
          >
            {!loadingMore ? "Load more" : "Loading..."}
          </Button>
        )}
      </div>
    </div>
  );
};

export default SearchResults;

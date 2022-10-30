import { UseYoutubeSearch } from "../../helpers/useYoutubeSearch";
import Thumbnail, { VideoInfo } from "../Thumbnail";

const SearchResults: React.FC<Omit<UseYoutubeSearch, "search">> = ({
  searchResults,
  loading,
}) => {
  return (
    <div className="mx-3 mt-2 mb-4 p-2 rounded border shadow-sm">
      {!loading && searchResults && (
        <div className="d-flex flex-row flex-wrap">
          {searchResults.map((searchResult) => {
            const videoInfo: VideoInfo = {
              channelTitle: searchResult.snippet.channelTitle,
              channelUrl: `https://www.youtube.com/channel/${searchResult.snippet.channelId}`,
              title: searchResult.snippet.title,
              url: `https://www.youtube.com/watch?v=${searchResult.id.videoId}`,
              description: searchResult.snippet.description,
              publishedAt: searchResult.snippet.publishedAt,
              thumbnailUrl: searchResult.snippet.thumbnails.medium.url,
            };
            return <Thumbnail key={searchResult.id.videoId} {...videoInfo} />;
          })}
        </div>
      )}
      {loading && <p className="m-0">Loading...</p>}
      {!loading && searchResults.length === 0 && (
        <p className="m-0">No videos.</p>
      )}
    </div>
  );
};

export default SearchResults;

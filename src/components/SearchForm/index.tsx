import {
  UseYoutubeSearch,
  YoutubeSearchParams,
} from "../../helpers/useYoutubeSearch";

const SearchForm: React.FC<Omit<UseYoutubeSearch, "searchResults">> = ({
  search,
  loading,
}) => {
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const params: YoutubeSearchParams = {
      part: "snippet",
      type: "video",
      eventType: "live",
      q: (e.target as any).elements["q"].value,
    };
    search(params);
  };
  return (
    <div className="mx-3 my-4 p-2 rounded border shadow-sm">
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            name="q"
            type="text"
            className="form-control"
            placeholder="Search keywords"
            aria-label="Search box"
          />
          <button type="submit" className="btn btn-outline-secondary">
            {loading && (
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            )}
            {!loading && "🔎"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;

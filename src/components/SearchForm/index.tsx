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
    const form = e.target as HTMLFormElement;
    const q = form.elements.namedItem("q") as HTMLInputElement;
    const params: YoutubeSearchParams = {
      part: "snippet",
      type: "video",
      eventType: "live",
      q: q.value,
    };
    search(params);
  };
  return (
    <div className="my-4 p-2 rounded border shadow-sm">
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

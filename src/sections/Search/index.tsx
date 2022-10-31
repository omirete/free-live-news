import { Container } from "react-bootstrap";
import SearchForm from "../../components/SearchForm";
import SearchResults from "../../components/SearchResults";
import useYoutubeSearch from "../../helpers/useYoutubeSearch";

const Search: React.FC = () => {
  const { loading, search, searchResults } = useYoutubeSearch(
    import.meta.env.VITE_GOOGLEAPIS_YT_API_KEY
  );
  return (
    <Container>
      <SearchForm search={search} loading={loading} />
      <SearchResults loading={loading} searchResults={searchResults} />
    </Container>
  );
};

export default Search;

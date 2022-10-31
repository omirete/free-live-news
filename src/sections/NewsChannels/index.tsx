import { Container } from "react-bootstrap";
import SearchResults from "../../components/SearchResults";
import Filters from "./Filters";
import useFilteredData from "./useFilteredData";

const NewsChannels: React.FC = () => {
  const { filteredData, loading, filterState, setFilter } = useFilteredData();
  return (
    <Container>
      <Filters filterState={filterState} setFilter={setFilter} />
      <SearchResults loading={loading} searchResults={filteredData} />
    </Container>
  );
};

export default NewsChannels;

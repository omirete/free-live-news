import { Dropdown } from "react-bootstrap";
import { Language, VideoType } from "./filterFieldTypes/types";
import { FilterSetter, FilterState } from "./useFilteredData";

const langs: Language[] = [
  {
    name: "All",
    code: "all",
    emoji: "All",
  },
  {
    name: "Spanish",
    code: "es",
    emoji: "🇪🇸",
  },
  {
    name: "English",
    code: "en",
    emoji: "🇬🇧",
  },
  {
    name: "German",
    code: "de",
    emoji: "🇩🇪",
  },
  {
    name: "French",
    code: "fr",
    emoji: "🇫🇷",
  },
];

const videoTypes: VideoType[] = [
  {
    name: "All",
    code: "all",
    emoji: "All",
  },
  {
    name: "News",
    code: "news",
    emoji: "📰",
  },
  {
    name: "Entertainment",
    code: "entertainment",
    emoji: "🍿",
  },
  {
    name: "Finance",
    code: "finance",
    emoji: "📈",
  },
];

export interface FiltersProps {
  filterState: FilterState;
  setFilter: FilterSetter;
}

const Filters: React.FC<FiltersProps> = ({ filterState, setFilter }) => {
  return (
    <div className="pt-2 d-flex flex-row align-items-center">
      <p className="p-0 my-0 ms-0 me-1">Filters:</p>
      <div className="me-1">
        <Dropdown>
          <Dropdown.Toggle
            size="sm"
            variant="outline-dark"
            className="border-0"
          >
            Language
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {langs.map((lang, i) => (
              <Dropdown.Item
                key={i}
                onClick={() => setFilter({ lang: lang.code })}
                active={filterState.lang === lang.code}
              >
                {lang.code !== "all" ? lang.emoji + " " : ""}
                {lang.name}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div className="me-1">
        <Dropdown>
          <Dropdown.Toggle
            size="sm"
            variant="outline-dark"
            className="border-0"
          >
            Type
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {videoTypes.map((videoType, i) => (
              <Dropdown.Item
                key={i}
                onClick={() => setFilter({ type: videoType.code })}
                active={filterState.type === videoType.code}
              >
                {videoType.code !== "all" ? videoType.emoji + " " : ""}
                {videoType.name}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

export default Filters;

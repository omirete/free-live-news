import { useEffect, useState } from "react";
import { ButtonGroup, Container, ToggleButton } from "react-bootstrap";
import SearchResults from "../../components/SearchResults";

export type LangCode = "all" | "es" | "en" | "de" | "fr";

export interface YoutubeResultWithCustomMetadata
  extends GoogleApiYouTubeSearchResource {
  custom_metadata: {
    lang: LangCode;
    region: string;
  };
}

export interface Language {
  name: string;
  code: LangCode;
  iconUrl: string;
  flagEmoji: string;
}

export interface FilterState {
  lang: LangCode;
}

const langs: Array<Language> = [
  { name: "All", code: "all", iconUrl: "All", flagEmoji: "All" },
  {
    name: "Spanish",
    code: "es",
    iconUrl: "/svg/flag_spain.svg",
    flagEmoji: "🇪🇸",
  },
  {
    name: "English",
    code: "en",
    iconUrl: "/svg/flag_uk.svg",
    flagEmoji: "🇬🇧",
  },
  {
    name: "German",
    code: "de",
    iconUrl: "/svg/flag_germany.svg",
    flagEmoji: "🇩🇪",
  },
  {
    name: "French",
    code: "fr",
    iconUrl: "/svg/flag_france.svg",
    flagEmoji: "🇫🇷",
  },
];

const NewsChannels: React.FC = () => {
  const [allResults, setAllResults] = useState<
    Array<YoutubeResultWithCustomMetadata>
  >([]);
  const [filters, setFilters] = useState<FilterState>({
    lang: "all",
  });
  const [filteredResults, setFilteredResults] = useState<
    Array<YoutubeResultWithCustomMetadata>
  >([]);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    fetch(`configs/news_videos.json`)
      .then((response) => response.json())
      .then((data: Array<YoutubeResultWithCustomMetadata>) =>
        setAllResults(data)
      )
      .then(() => setLoading(false));
  }, []);

  useEffect(() => {
    setFilteredResults(
      allResults.filter((item) => {
        let keep = true;
        if (filters.lang !== "all") {
          keep &&= item.custom_metadata.lang === filters.lang;
        }
        return keep;
      })
    );
  }, [allResults, filters]);

  return (
    <div>
      <Container className="pt-2">
        <h6 className="fw-bold">Filters</h6>
        <div className="d-flex justify-content-center align-items-center">
          <p className="p-0 my-0 ms-0 me-2">Language:</p>
          <ButtonGroup className="mt-2 d-block text-center">
            {langs.map((lang, i) => (
              <ToggleButton
                key={i}
                id={`lang-radio-${i}`}
                className="px-3 py-1"
                type="radio"
                variant="outline-secondary"
                name="radio"
                value={lang.code}
                checked={filters.lang === lang.code}
                onChange={(e) => {
                  e.preventDefault();
                  setFilters((prev) => ({
                    ...prev,
                    lang: e.target.value as LangCode,
                  }));
                }}
              >
                {lang.flagEmoji}
              </ToggleButton>
            ))}
          </ButtonGroup>
        </div>
      </Container>
      <SearchResults loading={loading} searchResults={filteredResults} />
    </div>
  );
};

export default NewsChannels;

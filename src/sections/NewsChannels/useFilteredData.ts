import { useCallback, useEffect, useState } from "react";
import { LangCode, VideoTypeCode } from "./filterFieldTypes/types";

export interface FilterState {
  lang: LangCode;
  type: VideoTypeCode;
  region: string;
}

export interface YoutubeResultWithCustomMetadata
  extends GoogleApiYouTubeSearchResource {
  custom_metadata: {
    lang: LangCode;
    region: string;
    type: VideoTypeCode;
  };
}

export type FilterSetter = (newState: Partial<FilterState>) => void;

export interface UseFilteredDataReturn {
  allData: YoutubeResultWithCustomMetadata[];
  filteredData: YoutubeResultWithCustomMetadata[];
  loading: boolean;
  filterState: FilterState;
  setFilter: FilterSetter;
}

const useFilteredData = (): UseFilteredDataReturn => {
  const [allData, setAllData] = useState<
    Array<YoutubeResultWithCustomMetadata>
  >([]);
  const [filteredData, setFilteredData] = useState<
    YoutubeResultWithCustomMetadata[]
  >([]);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    fetch(`configs/news_videos.json?v1`)
      .then((response) => response.json())
      .then((data: YoutubeResultWithCustomMetadata[]) => setAllData(data))
      .then(() => setLoading(false));
  }, []);

  const [filterState, setFilterState] = useState<FilterState>({
    lang: "all",
    type: "news",
    region: "all",
  });

  const setFilter: FilterSetter = useCallback(
    (newState: Partial<FilterState>) => {
      setFilterState((prev) => ({
        ...prev,
        ...newState,
      }));
    },
    [setFilterState]
  );

  useEffect(() => {
    setFilteredData(
      allData.filter((item) => {
        let keep = true;
        const filterKeys: Array<keyof FilterState> = ["lang", "type", "region"];
        filterKeys.forEach((key) => {
          if (filterState[key] !== "all") {
            keep &&= item.custom_metadata[key] === filterState[key];
          }
        });
        return keep;
      })
    );
  }, [allData, filterState]);

  return {
    allData,
    filteredData,
    loading,
    filterState,
    setFilter,
  };
};

export default useFilteredData;

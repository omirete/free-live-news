import { useCallback, useState } from "react";

const MAX_SEARCH_RESULTS = 5;

export interface YoutubeSearchParams {
  /**
   * The part parameter specifies a comma-separated list of one or more search resource properties that the API response will include. The part names that you can include in the parameter value are id and snippet. If the parameter identifies a property that contains child properties, the child properties will be included in the response. For example, in a search result, the snippet property contains other properties that identify the result's title, description, and so forth. If you set part=snippet, the API response will also contain all of those nested properties.
   */
  part: string;
  /**
   * The channelId parameter indicates that the API response should only contain resources created by the channel
   */
  channelId?: string | undefined;
  /**
   * The channelType parameter lets you restrict a search to a particular type of channel.
   */
  channelType?: string | undefined;
  /**
   * The forContentOwner parameter restricts the search to only retrieve resources owned by the content owner specified by the onBehalfOfContentOwner parameter. The user must be authenticated as a CMS account linked to the specified content owner and onBehalfOfContentOwner must be provided.
   */
  forContentOwner?: boolean | undefined;
  /**
   * The forMine parameter restricts the search to only retrieve videos owned by the authenticated user.
   */
  forMine?: boolean | undefined;
  /**
   * The maxResults parameter specifies the maximum number of items that should be returned in the result set.
   */
  maxResults?: number | undefined;
  /**
   * The onBehalfOfContentOwner parameter indicates that the authenticated user is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The actual CMS account that the user authenticates with needs to be linked to the specified YouTube content owner.
   */
  onBehalfOfContentOwner?: string | undefined;
  /**
   * The order parameter specifies the method that will be used to order resources in the API response.
   */
  order?: string | undefined;
  /**
   * The pageToken parameter identifies a specific page in the result set that should be returned. In an API response, the nextPageToken and prevPageToken properties identify other pages that could be retrieved.
   */
  pageToken?: string | undefined;
  /**
   * The publishedAfter parameter indicates that the API response should only contain resources created after the specified time. The value is an RFC 3339 formatted date-time value (1970-01-01T00:00:00Z).
   */
  publishedAfter?: string | undefined;
  /**
   * The publishedBefore parameter indicates that the API response should only contain resources created before the specified time. The value is an RFC 3339 formatted date-time value (1970-01-01T00:00:00Z).
   */
  publishedBefore?: string | undefined;
  /**
   * The q parameter specifies the query term to search for.
   */
  q?: string | undefined;
  /**
   * The eventType parameter specifies type of broadcast. If used, type parameter must be set to 'video'.
   */
  eventType?: string | undefined;
  /**
   * The regionCode parameter instructs the API to return search results for the specified country. The parameter value is an ISO 3166-1 alpha-2 country code.
   */
  regionCode?: string | undefined;
  /**
   * The relatedToVideoId parameter retrieves a list of videos that are related to the video that the parameter value identifies. The parameter value must be set to a YouTube video ID and, if you are using this parameter, the type parameter must be set to video.
   */
  relatedToVideoId?: string | undefined;
  /**
   * The safeSearch parameter indicates whether the search results should include restricted content as well as standard content.
   */
  safeSearch?: string | undefined;
  /**
   * The topicId parameter indicates that the API response should only contain resources associated with the specified topic. The value identifies a Freebase topic ID.
   */
  topicId?: string | undefined;
  /**
   * The type parameter restricts a search query to only retrieve a particular type of resource.
   */
  type?: string | undefined;
  /**
   * The videoCaption parameter indicates whether the API should filter video search results based on whether they have captions.
   */
  videoCaption?: string | undefined;
  /**
   * The videoCategoryId parameter filters video search results based on their category.
   */
  videoCategoryId?: string | undefined;
  /**
   * The videoDefinition parameter lets you restrict a search to only include either high definition (HD) or standard definition (SD) videos. HD videos are available for playback in at least 720p, though higher resolutions, like 1080p, might also be available.
   */
  videoDefinition?: string | undefined;
  /**
   * The videoDimension parameter lets you restrict a search to only retrieve 2D or 3D videos.
   */
  videoDimension?: string | undefined;
  /**
   * The videoDuration parameter filters video search results based on their duration.
   */
  videoDuration?: string | undefined;
  /**
   * The videoEmbeddable parameter lets you to restrict a search to only videos that can be embedded into a webpage.
   */
  videoEmbeddable?: string | undefined;
  /**
   * The videoLicense parameter filters search results to only include videos with a particular license. YouTube lets video uploaders choose to attach either the Creative Commons license or the standard YouTube license to each of their videos.
   */
  videoLicense?: string | undefined;
  /**
   * The videoSyndicated parameter lets you to restrict a search to only videos that can be played outside youtube.com.
   */
  videoSyndicated?: string | undefined;
  /**
   * The videoType parameter lets you restrict a search to a particular type of videos.
   */
  videoType?: string | undefined;
}
export interface YoutubeAPIErrorResponse {
  error: {
    code: number;
    message: string;
    errors: Array<{
      message: string;
      domain: string;
      reason: string;
    }>;
  };
}

export type YoutubeSearchFunction = (
  args: YoutubeSearchParams
) => Promise<GoogleApiYouTubeSearchResource[]>;

export type YoutubeLoadMoreFunction = () => Promise<
  GoogleApiYouTubeSearchResource[]
>;

export interface UseYoutubeSearch {
  loading: boolean;
  loadingMore: boolean;
  searchResults: GoogleApiYouTubeSearchResource[];
  endReached: boolean;
  search: YoutubeSearchFunction;
  loadMore: YoutubeLoadMoreFunction;
}

const useYoutubeSearch = (API_KEY: string): UseYoutubeSearch => {
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchResults, setSearchResults] = useState<
    Array<GoogleApiYouTubeSearchResource>
  >([]);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>();
  const [searchArgs, setSearchArgs] = useState<YoutubeSearchParams>({
    part: "snippet",
  });

  const getSearchResults = useCallback(
    async (
      args: YoutubeSearchParams,
      pageToken?: string
    ): Promise<
      GoogleApiYouTubePaginationInfo<GoogleApiYouTubeSearchResource>
    > => {
      // Setup search params ---------------------------------------------------
      const params = new URLSearchParams();
      Object.keys(args).forEach((argKey) => {
        const value: string = args[
          argKey as keyof YoutubeSearchParams
        ] as string;
        params.append(argKey, value);
      });
      params.set("key", API_KEY);
      params.set("maxResults", `${MAX_SEARCH_RESULTS}`);
      if (pageToken) params.set("pageToken", pageToken);
      // -----------------------------------------------------------------------

      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?${params.toString()}`,
        { method: "GET" }
      );
      if (response.status === 200) {
        const data: GoogleApiYouTubePaginationInfo<GoogleApiYouTubeSearchResource> =
          await response.json();
        return data;
      } else {
        const err: YoutubeAPIErrorResponse = await response.json();
        alert(err.error.message);
        return {
          etag: "",
          kind: "",
          pageInfo: { resultsPerPage: 0, totalResults: 0 },
          items: [],
          prevPageToken: "",
          nextPageToken: "",
        };
      }
    },
    [API_KEY, MAX_SEARCH_RESULTS]
  );

  const search: YoutubeSearchFunction = useCallback(
    async (args) => {
      setLoading(true);
      setSearchArgs(args);
      const results = await getSearchResults(args);
      if (results.nextPageToken) {
        setNextPageToken(results.nextPageToken);
      } else {
        setNextPageToken(undefined);
      }
      setSearchResults(results.items);
      setLoading(false);
      return results.items;
    },
    [getSearchResults]
  );

  const loadMore: YoutubeLoadMoreFunction = useCallback(async () => {
    setLoadingMore(true);
    const results = await getSearchResults(searchArgs, nextPageToken);
    if (results.nextPageToken) {
      setNextPageToken(results.nextPageToken);
    } else {
      setNextPageToken(undefined);
    }
    setSearchResults((prev) => [...prev, ...results.items]);
    setLoadingMore(false);
    return results.items;
  }, [getSearchResults, nextPageToken, searchArgs]);

  return {
    loading,
    searchResults,
    endReached: nextPageToken === undefined,
    search,
    loadMore,
    loadingMore,
  };
};

export default useYoutubeSearch;

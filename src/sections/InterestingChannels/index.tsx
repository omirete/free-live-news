import { useEffect, useState } from "react";
import SearchResults from "../../components/SearchResults";
import useYoutubeSearch from "../../helpers/useYoutubeSearch";

const InterestingChannels: React.FC = () => {
  const { search, loading } = useYoutubeSearch(
    "AIzaSyD4qpGWzhj8YWhJL5jcs7WDKXCnaqzDMO8"
  );

  const [searchResults, setSearchResults] = useState<
    Array<GoogleApiYouTubeSearchResource>
  >([]);

  useEffect(() => {
    setSearchResults([]);
    fetch(`configs/interesting_channels.json`)
      .then((response) => response.json())
      .then((data: Array<{ channel_id: string }>) =>
        data.map((d) => d.channel_id)
      )
      .then((channel_ids) => {
        // channel_ids.forEach((channelId) => {
        //     search({ part: 'snippet', channelId }
        //     ).then((results) => {
        //         setSearchResults((prev) => {
        //             prev.push(...results)
        //             return prev
        //         })
        //     })
        // })
      });
  }, [search]);

  return <SearchResults loading={loading} searchResults={searchResults} />;
};

export default InterestingChannels;

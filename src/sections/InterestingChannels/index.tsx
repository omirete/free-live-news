import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import charStringToNumber from "../../helpers/charStringToNumber";

interface ChannelInfo {
  alias: string;
  id: string;
  is_user: boolean;
}

const InterestingChannels: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [channelsInfo, setChannelsInfo] = useState<ChannelInfo[]>([]);

  useEffect(() => {
    setLoading(true);
    fetch(`configs/interesting_channels.json?v3`)
      .then((response) => response.json())
      .then((data: ChannelInfo[]) => {
        setChannelsInfo(data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container className="mt-3 d-flex flex-wrap">
      {!loading &&
        channelsInfo.map((channelInfo, i) => (
          <div key={i} className="m-1">
            <a
              key={i}
              href={`https://www.youtube.com/${
                channelInfo.is_user ? "user" : "c"
              }/${channelInfo.alias}`}
              target="_blank"
              rel="noreferrer"
              className={`
                text-decoration-none py-3 px-4
                btn
            `}
              style={{
                backgroundColor: `hsl(${
                  charStringToNumber(channelInfo.id) % 360
                }, 100%, 80%)`,
              }}
            >
              {channelInfo.alias}
            </a>
          </div>
        ))}
    </Container>
  );
};

export default InterestingChannels;

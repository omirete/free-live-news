import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import charStringToNumber from "../../helpers/charStringToNumber";

const InterestingChannels: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [channelAliases, setChannelAliases] = useState<Array<string>>([]);

  useEffect(() => {
    setLoading(true);
    setChannelAliases([]);
    fetch(`configs/interesting_channels.json?v2`)
      .then((response) => response.json())
      .then((data: Array<{ channel_id: string }>) =>
        data.map((d) => d.channel_id)
      )
      .then((channel_ids) => {
        setChannelAliases(channel_ids);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container className="mt-3 d-flex flex-wrap">
      {!loading &&
        channelAliases.map((alias, i) => (
          <div key={i} className="m-1">
            <a
              key={i}
              href={`https://www.youtube.com/c/${alias}`}
              target="_blank"
              rel="noreferrer"
              className={`
                text-decoration-none py-3 px-4
                btn
            `}
              style={{
                backgroundColor: `hsl(${
                  charStringToNumber(alias) % 360
                }, 100%, 80%)`,
              }}
            >
              {alias}
            </a>
          </div>
        ))}
    </Container>
  );
};

export default InterestingChannels;

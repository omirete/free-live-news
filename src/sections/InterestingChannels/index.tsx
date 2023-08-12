import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";

interface ChannelInfo {
    alias: string;
    id: string;
    is_user: boolean;
    type: string;
    lang: string;
    region: string;
    iconUrl?: string;
    bannerUrl?: string;
    title: string;
    description: string;
}

const InterestingChannels: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [channelsInfo, setChannelsInfo] = useState<ChannelInfo[]>([]);

    useEffect(() => {
        setLoading(true);
        fetch(`configs/interesting_channels.json?${import.meta.env.VITE_CONFIGS_VERSION}`)
            .then((response) => response.json())
            .then((data: Record<string, ChannelInfo>) => {
                setChannelsInfo(Object.values(data));
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <Container className="mt-3 d-flex flex-wrap">
            {!loading &&
                channelsInfo.map((channelInfo, i) => (
                    <div key={i} className="m-2">
                        <a
                            className="card p-2 text-decoration-none text-dark bg-light-hover shadow-sm-hover"
                            href={`https://www.youtube.com/${
                                channelInfo.is_user ? "user" : "c"
                            }/${channelInfo.alias}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <div className="d-flex align-items-center">
                                <div className="image">
                                    <img
                                        src={channelInfo.iconUrl}
                                        className="rounded"
                                        width="50"
                                        height="50"
                                    />
                                </div>

                                <div className="ms-2 w-100">
                                    <h4 className="mb-0 mt-0">
                                        {channelInfo.title}
                                    </h4>
                                    <span>
                                        {channelInfo.type} |{" "}
                                        {channelInfo.region} ({channelInfo.lang}
                                        )
                                    </span>
                                </div>
                            </div>
                        </a>
                    </div>
                ))}
        </Container>
    );
};

export default InterestingChannels;

export interface VideoInfo {
  url: string;
  title: string;
  channelTitle: string;
  channelUrl: string;
  description?: string;
  publishedAt?: string;
  thumbnailUrl?: string;
}

const Thumbnail: React.FC<VideoInfo> = ({
  url,
  title,
  description,
  thumbnailUrl,
  channelUrl,
  channelTitle,
  publishedAt,
}) => {
  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 p-1">
      <div className="card">
        <a href={url}>
          <img src={thumbnailUrl} className="card-img-top" alt={description} />
        </a>
        <div className="card-body">
          <h5 className="card-title text-nowrap overflow-hidden">
            <a href={url} className="text-decoration-none text-dark">
              {title}
            </a>
          </h5>
          <small className="d-block card-text">
            <a href={channelUrl} className="text-decoration-none text-muted">
              {channelTitle}
            </a>
          </small>
          <p className="card-text small text-muted">
            Active since: {publishedAt}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Thumbnail;

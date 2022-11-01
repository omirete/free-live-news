export interface VideoInfo
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
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
  className,
}) => {
  return (
    <div className={`col-12 col-sm-6 col-md-4 col-lg-3 ${className}`}>
      <div className="card">
        <a href={url} target="_blank" rel="noreferrer">
          <img src={thumbnailUrl} className="card-img-top" alt={description} />
        </a>
        <div className="card-body">
          <h5 className="card-title text-nowrap overflow-hidden">
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="text-decoration-none text-dark"
            >
              {title}
            </a>
          </h5>
          <small className="d-block card-text">
            <a
              href={channelUrl}
              target="_blank"
              rel="noreferrer"
              className="text-decoration-none text-muted"
            >
              {channelTitle}
            </a>
          </small>
          <p className="card-text small text-muted">
            Active since:{" "}
            {new Date(publishedAt as string).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Thumbnail;

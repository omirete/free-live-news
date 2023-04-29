import json
import argparse
import requests
from ftputil import FTPHost


def get_channel_info(api_key: str, channel_ids: list[str]) -> dict:

    # Setup search params ------------------------------------------------------
    parts = [
        "snippet",
        "statistics",
        "brandingSettings",
        "status",  # contains the "madeForKids" property
        "topicDetails"
    ]

    params = {
        # The "part" paramenter needs to be set to "snippet" as per the docs:
        # https://developers.google.com/youtube/v3/docs/search/list
        "part": ','.join(parts),
        "key": api_key,
        "id": ','.join(channel_ids),
    }
    # --------------------------------------------------------------------------

    base_endpoint = 'https://www.googleapis.com/youtube/v3/channels'

    res = requests.get(base_endpoint, params)
    if res.status_code == 200:
        results = res.json()
        items = results["items"]
        channel_info = {}
        for i in items:
            channel_info[i["id"]] = i
        return channel_info
    else:
        res.raise_for_status()


def get_interesting_channels() -> dict:
    with open('public/configs/interesting_channels.json', 'r', encoding='utf-8') as f:
        return json.load(f)


def save_channel_icons() -> None:
    pass


def parseArgs() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        prog='Free live news: Update list of videos',
        description="Finds all active news videos and saves the result to an FTP directory.",
        epilog='For questions, reach out to the developer (GitHub user: /omirete).')

    parser.add_argument('-k', '--api_key', required=True)
    parser.add_argument('--ftp_host', required=True)
    parser.add_argument('-u', '--ftp_usr', required=False)
    parser.add_argument('-p', '--ftp_pwd', required=False)
    parser.add_argument('-d', '--debug', required=False, action='store_true')

    return parser.parse_args()


def store_channel_images(channel_info: dict, ftp_host: str, ftp_usr: str = None, ftp_pwd: str = None, debug: bool = False) -> list[dict]:
    channels = get_interesting_channels()

    for id in channels.keys():
        if id in channel_info.keys():
            channels[id]["iconUrl"] = channel_info[id]["snippet"]["thumbnails"]["medium"]["url"]
            channels[id]["bannerUrl"] = channel_info[id]["brandingSettings"]["image"]["bannerExternalUrl"]
            channels[id]["title"] = channel_info[id]["snippet"]["title"]
            channels[id]["description"] = channel_info[id]["snippet"]["description"]

    with FTPHost(ftp_host, ftp_usr, ftp_pwd) as ftp:
        with ftp.open('freelivenews.rocks/configs/interesting_channels.json', 'w', encoding='utf-8') as f:
            json.dump(channels, f, ensure_ascii=False)


def main(api_key: str, ftp_host: str, ftp_usr: str = None, ftp_pwd: str = None, debug: bool = False):
    channels = get_interesting_channels()
    channel_ids = list(channels.keys())
    channel_info = get_channel_info(api_key, channel_ids)
    store_channel_images(channel_info, ftp_host, ftp_usr, ftp_pwd, debug)


if __name__ == "__main__":
    args = parseArgs()
    main(args.api_key, args.ftp_host, args.ftp_usr, args.ftp_pwd, args.debug)

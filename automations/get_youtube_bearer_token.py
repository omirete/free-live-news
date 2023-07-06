import google_auth_oauthlib
import google_auth_oauthlib.flow

scopes = ["https://www.googleapis.com/auth/youtube.force-ssl"]

api_service_name = "youtube"
api_version = "v3"
client_secrets_file = "client_secret.json"

def main():
    # Get credentials and create an API client
    flow = google_auth_oauthlib.flow.InstalledAppFlow.from_client_secrets_file(
        client_secrets_file,
        scopes
    )
    credentials = flow.run_local_server()
    print(credentials.to_json())

if __name__ == "__main__":
    main()

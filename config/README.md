# Environment Configuration

This framework uses unified configuration files for each environment.

## Configuration Files

### `dev_config.env`
- **WEB DATA**: Development UI configuration
- **API DATA**: Development Graph API configuration

### `stage_config.env`
- **WEB DATA**: Staging UI configuration
- **API DATA**: Staging Graph API configuration

Facebook has no public staging host, so both files point at `https://www.facebook.com`. The two files exist so the `ENV=` switch works exactly as in `qa_automation_base`, and so you can keep two different test accounts.

## Usage

### Default Environment (Stage)
```bash
npx playwright test tests/web/LoginLogout.spec.js
```

### Specify Environment (Dev)
```bash
# PowerShell
$env:ENV="dev"; npx playwright test tests/web/LoginLogout.spec.js

# Bash/Linux/macOS
ENV=dev npx playwright test tests/web/LoginLogout.spec.js
```

## Configuration Variables

### Web Variables
- `BASE_URL`: Application URL
- `email`: Test account email or phone number
- `PASSWORD`: Test account password

### API Variables
- `BASE_URL_API`: Graph API base URL (versioned)
- `FB_ACCESS_TOKEN`: User access token from the Graph API Explorer (needs `public_profile`)

## Getting a Graph API token

1. Open the Meta Graph API Explorer (developers.facebook.com/tools/explorer)
2. Select your app and click **Generate Access Token**
3. Grant `public_profile`
4. Copy the token into `FB_ACCESS_TOKEN`

Tokens expire after about an hour unless extended. The API fixture fails fast with a clear message when the token is invalid.

## Security

The real `{env}_config.env` files are gitignored. After cloning, create them from the templates:

```bash
cp config/stage_config.env.example config/stage_config.env
cp config/dev_config.env.example config/dev_config.env
```

If a real file is missing, `loadEnv()` falls back to the `.example` template. Replace every placeholder before running. Never commit a real password or token. CI should inject these via environment variables, which take precedence over the `.env` file because `dotenv` does not override existing variables.

## Adding New Environments

1. Create new config file: `{env}_config.env`
2. Add WEB DATA and API DATA sections
3. Use with: `ENV={env} npx playwright test ...`

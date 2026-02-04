# Auth0 Configuration Instructions

## Multi-Factor Authentication (MFA) Setup

1. Log in to your Auth0 Dashboard: https://manage.auth0.com/
2. Navigate to **Security** → **Multi-factor Auth**
3. Enable **Email** as an MFA factor
4. Configure email settings:
   - Enable "Always require Multi-factor Authentication"
   - Or enable "Adaptive MFA" based on risk assessment

## Restrict Public Signups

1. In Auth0 Dashboard, go to **Authentication** → **Database** → **Username-Password-Authentication**
2. Under **Settings** tab:
   - Disable "Disable Sign Ups" toggle (set to OFF to prevent public registration)
3. Click **Save**

## Create Test User

1. Navigate to **User Management** → **Users**
2. Click **Create User**
3. Fill in details:
   - **Email**: careers@fidenz.com
   - **Password**: Pass#fidenz
   - **Connection**: Username-Password-Authentication
4. Click **Create**

## Whitelist Configuration

To allow only specific users:

1. Go to **Actions** → **Flows** → **Login**
2. Create a new Action or edit existing:

```javascript
exports.onExecutePostLogin = async (event, api) => {
  const allowedEmails = ['careers@fidenz.com'];
  
  if (!allowedEmails.includes(event.user.email)) {
    api.access.deny('Access denied. Only whitelisted users can log in.');
  }
};
```

3. Deploy the action and add it to the Login flow

## Configure Allowed Callback URLs

1. Go to **Applications** → **Applications**
2. Select your application
3. Under **Application URIs**:
   - **Allowed Callback URLs**: `http://localhost:5173, http://localhost:5174`
   - **Allowed Logout URLs**: `http://localhost:5173, http://localhost:5174`
   - **Allowed Web Origins**: `http://localhost:5173, http://localhost:5174`
4. Click **Save Changes**

## Verify Configuration

- MFA is enabled for all users
- Public signups are disabled
- Only whitelisted users (careers@fidenz.com) can log in
- Test user credentials work correctly

## Current Application Details

- **Domain**: dev-d2l2uyw511hsvvru.us.auth0.com
- **Client ID**: Yak2f2K9SkMlAES2B0LH8qJdMHc2BhD6
- **Test User**: careers@fidenz.com / Pass#fidenz

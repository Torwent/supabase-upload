# supabase-upload

Upload files to a Supabase bucket.

# Optional pre-requisites

Unless you want your bucket open for everyone with anyone able to upload files to it, you will want to create a user with rights to INSERT into your bucket.
To create a user, simply create this small script and run it:

```JavaScript
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const createUser = async () => {
	const { user, session, error } = await supabase.auth.signUp({
	email: 'example@email.com',
	password: 'example-password',
	})
}

createUser()
```
Edit the `SUPABASE_URL` and `SUPABASE_ANON_KEY` with your respective URL and ANON Key and `example@email.com` and it's `example-password` to whatever you want your user to have.
Personally I just call the user something I will recognize easily later like `github@waspscripts.com`.

Keep in mind that if the email does not actually exist, you should disable email confirmations in supabase:
`Authentication > Settings > Email Auth > Enable email confirmations`
After having the account created you can turn it back on.

# Bucket setup
Go to:
`Storage > Policies`
Click `New policy` in the bucket you want upload files to and then `For full customization`.
Give it a name, whatever you want you will recognize.
Enable `INSERT` and now if you want to let anyone to upload files simply type in the `Policy definition`:
```
true
```
And save it.

If you created a user specifically for this, you will want to type this:
```
((uid())::text = 'USER_ID'::text)
```
`USER_ID` is your user UID which you can get from the authentication tab.
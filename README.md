# supabase-upload

Upload files to a Supabase bucket

# Pre-requisites

Have a user added in Supabase.
I would recomment you to create a user specifically for this, if you make up the email, disable email confirmations first:

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

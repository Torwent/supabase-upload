import { getInput } from "@actions/core"
import { createClient } from "@supabase/supabase-js"
import { readFileSync } from "fs"
import { basename } from "path"
import { sync } from "glob"

let isLoggedIn = false

const filePath = process.cwd() + "/"
const fileArray = sync(filePath + getInput("ORIGIN_PATH"))
console.log("Files found to upload: ", fileArray)

const supabase = createClient(
  getInput("SUPABASE_URL"),
  getInput("SUPABASE_ANON_KEY")
)

const run = async (file) => {
  if (!isLoggedIn && getInput("EMAIL") !== "" && getInput("PASSWORD") !== "") {
    const { loginError } = await supabase.auth.signIn({
      email: getInput("EMAIL"),
      password: getInput("PASSWORD"),
    })

    if (loginError) {
      console.log(loginError)
    } else {
      isLoggedIn = true
      console.log("Logged in as: ", getInput("EMAIL"))
    }
  }

  let f = readFileSync(file)

  let fullPath = getInput("TARGET_PATH") + basename(file)
  console.log("Full path: ", fullPath)
  const { uploadError } = await supabase.storage
    .from(getInput("BUCKET"))
    .upload(fullPath, f)

  if (uploadError) {
    console.log(uploadError)
  } else {
    console.log(file, " uploaded.")
  }
}

for (let f of fileArray) {
  run(f)
}

if (isLoggedIn) {
  const { logoutError } = await supabase.auth.signOut()
  if (logoutError) {
    console.log(logoutError)
  } else {
    isLoggedIn = false
    console.log("Logged out of ", getInput("EMAIL"))
  }
}

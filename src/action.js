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
  let f = readFileSync(file)

  let fullPath = getInput("TARGET_PATH") + basename(file)
  console.log("Full destination path: ", fullPath)
  const { error } = await supabase.storage
    .from(getInput("BUCKET"))
    .upload(fullPath, f)

  if (error) {
    console.log("Got an error: ", error)
  } else {
    console.log(file, " uploaded.")
  }
}

if (!isLoggedIn && getInput("EMAIL") !== "" && getInput("PASSWORD") !== "") {
  const { error } = await supabase.auth.signIn({
    email: getInput("EMAIL"),
    password: getInput("PASSWORD"),
  })

  if (error) {
    console.log(error)
  } else {
    isLoggedIn = true
    console.log("Logged in as: ", getInput("EMAIL"))
  }
}

for (let file of fileArray) {
  run(file)
}

if (isLoggedIn) {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.log(error)
  } else {
    isLoggedIn = false
    console.log("Logged out of ", getInput("EMAIL"), ".")
  }
}
